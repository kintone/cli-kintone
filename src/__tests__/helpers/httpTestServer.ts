import http from "node:http";
import type { AddressInfo } from "node:net";

/**
 * A single HTTP request captured by HttpTestServer, already parsed for
 * convenient assertions.
 */
export type CapturedRequest = {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: http.IncomingHttpHeaders;
  /** Parsed as JSON when the request's Content-Type is application/json, otherwise the raw string. */
  body: unknown;
  /** UTF-8 decoding of rawBodyBuffer, for convenience with text bodies. Lossy for binary bodies -- use rawBodyBuffer for those. */
  rawBody: string;
  /** The exact bytes received, untouched by any encoding. Required for asserting binary/multipart bodies. */
  rawBodyBuffer: Buffer;
};

export type HttpTestServerResponse =
  | {
      status: number;
      body?: unknown;
      headers?: Record<string, string>;
    }
  | {
      /** Destroys the socket without writing a response, to simulate a transport-level failure (e.g. connection reset). */
      destroySocket: true;
    };

export type HttpTestServerHandler = (
  req: CapturedRequest,
) => HttpTestServerResponse | Promise<HttpTestServerResponse>;

const defaultHandler: HttpTestServerHandler = () => {
  throw new Error(
    "HttpTestServer received a request but no handler is set. Call server.setHandler(...) before exercising the client.",
  );
};

/**
 * A real HTTP server (node:http) listening on an ephemeral loopback port,
 * for characterization tests that exercise `@kintone/rest-api-client` end
 * to end -- through a real socket rather than an in-process interceptor --
 * so the same test keeps passing whether the client is backed by axios or
 * fetch/undici.
 *
 * Usage: start once per test file (in beforeAll), setHandler per test to
 * script the response, and inspect `requests` to assert what the client
 * actually sent over the wire.
 */
export class HttpTestServer {
  private readonly server: http.Server;
  private handler: HttpTestServerHandler = defaultHandler;
  private _requests: CapturedRequest[] = [];

  private constructor() {
    this.server = http.createServer((req, res) => this.onRequest(req, res));
  }

  static async start(): Promise<HttpTestServer> {
    const instance = new HttpTestServer();
    await new Promise<void>((resolve) =>
      instance.server.listen(0, "localhost", resolve),
    );
    return instance;
  }

  private onRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      this.handleRequest(req, res, chunks).catch((e: unknown) => {
        res.destroy(e instanceof Error ? e : new Error(String(e)));
      });
    });
  }

  private async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    chunks: Buffer[],
  ): Promise<void> {
    const rawBodyBuffer = Buffer.concat(chunks);
    const rawBody = rawBodyBuffer.toString("utf-8");
    const url = new URL(req.url ?? "/", this.baseUrl);
    const contentType = req.headers["content-type"] ?? "";

    let body: unknown = rawBody;
    if (contentType.includes("application/json") && rawBody.length > 0) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        // Not valid JSON despite the header; keep the raw string so the
        // assertion surfaces the mismatch instead of the parse error.
      }
    }

    const captured: CapturedRequest = {
      method: req.method ?? "",
      path: url.pathname,
      query: url.searchParams,
      headers: req.headers,
      body,
      rawBody,
      rawBodyBuffer,
    };
    this._requests.push(captured);

    try {
      const result = await this.handler(captured);
      if ("destroySocket" in result) {
        res.destroy();
        return;
      }
      res.writeHead(result.status, {
        "Content-Type": "application/json",
        ...result.headers,
      });
      res.end(
        result.body !== undefined ? JSON.stringify(result.body) : undefined,
      );
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          code: "TEST_HANDLER_ERROR",
          message: e instanceof Error ? e.message : String(e),
        }),
      );
    }
  }

  /** Replaces the response-scripting handler. Call this at the start of each test. */
  setHandler(handler: HttpTestServerHandler): void {
    this.handler = handler;
  }

  /** Requests captured since the server started (or since the last reset()). */
  get requests(): readonly CapturedRequest[] {
    return this._requests;
  }

  /** Clears captured requests and restores the default (throwing) handler. Call between tests. */
  reset(): void {
    this._requests = [];
    this.handler = defaultHandler;
  }

  get baseUrl(): string {
    const address = this.server.address() as AddressInfo;
    return `http://localhost:${address.port}`;
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

export type MultipartPart = {
  name: string;
  filename?: string;
  contentType?: string;
  data: Buffer;
};

/**
 * Minimal multipart/form-data parser for assertions -- not a general-purpose
 * decoder. The boundary is random per request (form-data generates it), so
 * tests must extract fields from the parsed parts rather than snapshotting
 * the raw body.
 */
export const parseMultipartFormData = (
  req: CapturedRequest,
): MultipartPart[] => {
  const contentType = req.headers["content-type"] ?? "";
  const boundaryMatch = /boundary=(?:"([^"]+)"|([^;]+))/.exec(contentType);
  if (!boundaryMatch) {
    throw new Error(`Content-Type has no multipart boundary: ${contentType}`);
  }
  const boundaryMarker = Buffer.from(
    `--${boundaryMatch[1] ?? boundaryMatch[2]}`,
  );
  const buffer = req.rawBodyBuffer;

  const parts: MultipartPart[] = [];
  let boundaryStart = buffer.indexOf(boundaryMarker);
  while (boundaryStart !== -1) {
    const partStart = boundaryStart + boundaryMarker.length;
    const nextBoundaryStart = buffer.indexOf(boundaryMarker, partStart);
    if (nextBoundaryStart === -1) {
      break;
    }

    // The segment between this boundary and the next is "\r\n<headers>\r\n\r\n<body>\r\n".
    let segment = buffer.subarray(partStart, nextBoundaryStart);
    if (segment.subarray(0, 2).toString("ascii") === "\r\n") {
      segment = segment.subarray(2);
    }
    if (segment.subarray(-2).toString("ascii") === "\r\n") {
      segment = segment.subarray(0, -2);
    }

    const headerEnd = segment.indexOf("\r\n\r\n");
    if (headerEnd !== -1) {
      const headerText = segment.subarray(0, headerEnd).toString("utf-8");
      const data = segment.subarray(headerEnd + 4);
      const dispositionMatch = /name="([^"]*)"(?:;\s*filename="([^"]*)")?/.exec(
        headerText,
      );
      const contentTypeMatch = /Content-Type:\s*([^\r\n]+)/i.exec(headerText);
      parts.push({
        name: dispositionMatch?.[1] ?? "",
        filename: dispositionMatch?.[2],
        contentType: contentTypeMatch?.[1],
        data,
      });
    }

    boundaryStart = nextBoundaryStart;
  }
  return parts;
};

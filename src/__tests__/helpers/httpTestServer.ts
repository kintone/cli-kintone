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
  rawBody: string;
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
    const rawBody = Buffer.concat(chunks).toString("utf-8");
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

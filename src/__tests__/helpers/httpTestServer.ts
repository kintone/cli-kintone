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
      /**
       * Sends this string/Buffer exactly as-is, without JSON.stringify.
       * Use this for a response that is deliberately NOT valid JSON (e.g. an
       * HTML error page from an intermediary) -- `body` always gets
       * JSON.stringify'd, so it can only ever produce valid JSON (even a
       * plain string becomes a valid JSON string literal), which is the
       * wrong tool for that case.
       */
      status: number;
      rawBody: string | Buffer;
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
 * Merges `overrides` onto `defaults`, treating header names as
 * case-insensitive (HTTP header names are). A plain `{...defaults,
 * ...overrides}` spread would leave both `Content-Type` (the default) and a
 * test-supplied `content-type` on the wire, with Node deciding which one
 * wins -- this makes the override always win regardless of casing.
 */
const mergeHeaders = (
  defaults: Record<string, string>,
  overrides?: Record<string, string>,
): Record<string, string> => {
  if (!overrides) {
    return { ...defaults };
  }
  const overrideKeysLower = new Set(
    Object.keys(overrides).map((k) => k.toLowerCase()),
  );
  const merged: Record<string, string> = {};
  for (const [key, value] of Object.entries(defaults)) {
    if (!overrideKeysLower.has(key.toLowerCase())) {
      merged[key] = value;
    }
  }
  return { ...merged, ...overrides };
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
 *
 * Binds and reports "localhost", not "127.0.0.1", deliberately:
 * KintoneRestAPIClient's own baseUrl validation only allows a plain http://
 * baseUrl when the hostname is exactly "localhost" (any other hostname,
 * `127.0.0.1` included, must be https). Using "localhost" for both the bind
 * address and baseUrl keeps them consistent regardless of which address
 * family "localhost" resolves to.
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
    // Without this, a client that aborts mid-request (e.g. the
    // destroySocket path exercised from the *other* end, or a client-side
    // timeout) raises an unhandled 'error' on the request stream, which
    // crashes the whole test process instead of just failing the assertion.
    req.on("error", () => {
      /* client aborted the request; nothing to respond to */
    });
    res.on("error", () => {
      /* client went away before the response was fully written */
    });
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
      res.writeHead(
        result.status,
        mergeHeaders({ "Content-Type": "application/json" }, result.headers),
      );
      if ("rawBody" in result) {
        res.end(result.rawBody);
      } else {
        res.end(
          result.body !== undefined ? JSON.stringify(result.body) : undefined,
        );
      }
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
    // This test server is exercised by both axios (keepAlive: false, so
    // idle sockets close themselves) and, after the planned migration,
    // fetch/undici (keep-alive by default). Without closeAllConnections(),
    // close() would wait out the server's keepAliveTimeout (5s default) on
    // every idle connection once that migration lands.
    this.server.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

import http from "node:http";
import type { AddressInfo, Socket } from "node:net";

export type CapturedConnect = {
  /** "host:port" from the CONNECT request line, e.g. "kintone.invalid:443". */
  target: string;
  headers: http.IncomingHttpHeaders;
};

/**
 * A minimal HTTP proxy that only understands CONNECT, for asserting that
 * cli-kintone's httpsProxy option actually reaches the HTTP client as a
 * proxy agent. It never completes the tunnel -- it records the CONNECT
 * target and destroys the socket, so the client call fails afterward; tests
 * using this assert on what the proxy *saw*, not on a response.
 */
export class ConnectProxyServer {
  private readonly server: http.Server;
  private _connects: CapturedConnect[] = [];

  private constructor() {
    this.server = http.createServer((_req, res) => {
      res.writeHead(400);
      res.end("This proxy only supports CONNECT.");
    });
    this.server.on("connect", (req: http.IncomingMessage, socket: Socket) => {
      // This proxy always destroys the tunnel socket itself, but the client
      // may also tear its end down concurrently -- without this, that races
      // into an unhandled 'error' that crashes the test process.
      socket.on("error", () => {
        /* client side of the tunnel went away; nothing to do */
      });
      this._connects.push({ target: req.url ?? "", headers: req.headers });
      socket.destroy();
    });
  }

  static async start(): Promise<ConnectProxyServer> {
    const instance = new ConnectProxyServer();
    await new Promise<void>((resolve) =>
      instance.server.listen(0, "localhost", resolve),
    );
    return instance;
  }

  get connects(): readonly CapturedConnect[] {
    return this._connects;
  }

  reset(): void {
    this._connects = [];
  }

  get url(): string {
    const address = this.server.address() as AddressInfo;
    return `http://localhost:${address.port}`;
  }

  async close(): Promise<void> {
    this.server.closeAllConnections();
    await new Promise<void>((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

import { beforeAll, afterAll, beforeEach } from "vitest";
import { buildRestAPIClient } from "../client";
import {
  HttpTestServer,
  type CapturedRequest,
} from "../../__tests__/helpers/httpTestServer";
import { ConnectProxyServer } from "../../__tests__/helpers/connectProxyServer";
import * as packageJson from "../../../package.json";

/**
 * Characterization test for buildRestAPIClient: unlike
 * src/__tests__/api.test.ts (which mocks the KintoneRestAPIClient
 * constructor to assert what arguments cli-kintone passes it), this drives
 * a real request through the built client to confirm those arguments
 * actually take effect on the wire -- specifically the custom User-Agent,
 * which api.test.ts can only assert was passed as a constructor option.
 */
describe("buildRestAPIClient (HTTP level)", () => {
  let server: HttpTestServer;

  beforeAll(async () => {
    server = await HttpTestServer.start();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    server.reset();
  });

  it("sends the cli-kintone User-Agent on the actual request", async () => {
    server.setHandler((_req: CapturedRequest) => ({
      status: 200,
      body: { records: [] },
    }));

    const apiClient = buildRestAPIClient({
      baseUrl: server.baseUrl,
      apiToken: "dummy-api-token",
    });

    await apiClient.record.getAllRecordsWithId({ app: "1", fields: ["$id"] });

    expect(server.requests).toHaveLength(1);
    // Never assert full equality: the embedded rest-api-client version
    // changes with the axios -> fetch migration, and the Node/platform
    // portion varies by machine.
    expect(server.requests[0].headers["user-agent"]).toContain(
      `${packageJson.name}@${packageJson.version}`,
    );
  });
});

/**
 * Characterization test for buildHttpsAgent's proxy path. It cannot use
 * HttpTestServer: an httpsAgent is only ever selected for https:// targets,
 * and HttpTestServer only speaks plain http. So instead of a target server,
 * this points at an unresolvable https:// host (`.invalid` is a reserved
 * TLD guaranteed never to resolve) with an HttpsProxyAgent attached, and
 * asserts that the client sends a plaintext `CONNECT host:443` to the proxy
 * before ever attempting TLS or DNS resolution on the target.
 *
 * This is a precise detector for a regression like js-sdk's 0309c872 (a
 * caller-supplied agent silently dropped): if the agent isn't honored, the
 * client goes direct, DNS resolution on the .invalid host fails
 * immediately, and the proxy never sees a CONNECT at all.
 *
 * client-cert (pfx) is not covered here: verifying it requires a real TLS
 * handshake against a server whose certificate the client must trust, and
 * buildHttpsAgent has no ca/rejectUnauthorized escape hatch -- that needs a
 * separate vitest project with NODE_EXTRA_CA_CERTS set at process start.
 * Tracked as a known gap, not attempted in this file.
 */
describe("buildRestAPIClient proxy support (HTTP level)", () => {
  let proxy: ConnectProxyServer;

  beforeAll(async () => {
    proxy = await ConnectProxyServer.start();
  });

  afterAll(async () => {
    await proxy.close();
  });

  beforeEach(() => {
    proxy.reset();
  });

  it("sends a CONNECT for the https target through the configured proxy", async () => {
    const apiClient = buildRestAPIClient({
      baseUrl: "https://kintone.invalid",
      apiToken: "dummy-api-token",
      httpsProxy: proxy.url,
    });

    await apiClient.record
      .getAllRecordsWithId({ app: "1", fields: ["$id"] })
      .catch(() => {
        // Expected: the proxy destroys the tunnel before any response, so
        // the call fails. What matters is what the proxy observed.
      });

    expect(proxy.connects).toHaveLength(1);
    expect(proxy.connects[0].target).toBe("kintone.invalid:443");
  });
});

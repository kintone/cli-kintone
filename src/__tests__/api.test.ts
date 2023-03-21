import { jest } from "@jest/globals";
import packageJson from "../../package.json" assert { type: "json" };
const expectedUa = `${packageJson.name}@${packageJson.version}`;

jest.unstable_mockModule("node:fs", () => ({
  default: {
    readFileSync: jest.fn().mockReturnValue("dummy"),
  },
}));

jest.unstable_mockModule("node:https", () => ({
  Agent: jest
    .fn<(...args: any[]) => any>()
    .mockImplementation(
      (opts?: { pfx?: Buffer | string; passphrase?: string }) => {
        const agentInstance: {
          pfx?: Buffer | string;
          passphrase?: string;
        } = {};
        if (opts?.pfx) {
          agentInstance.pfx = opts.pfx;
        }
        if (opts?.passphrase) {
          agentInstance.passphrase = opts.passphrase;
        }
        return agentInstance;
      }
    ),
}));

const https = await import("node:https");

jest.unstable_mockModule("https-proxy-agent", () => ({
  default: jest
    .fn<(...args: any[]) => any>()
    .mockImplementation(
      (opts: {
        protocol?: string;
        host?: string;
        port?: string;
        pfx?: Buffer | string;
        passphrase?: string;
      }) => {
        const agentInstance: {
          protocol?: string;
          host?: string;
          port?: string;
          pfx?: Buffer | string;
          passphrase?: string;
        } = {};

        if (opts.protocol) {
          agentInstance.protocol = opts.protocol;
        }
        if (opts.host) {
          agentInstance.host = opts.host;
        }
        if (opts.port) {
          agentInstance.port = opts.port;
        }
        if (opts.pfx) {
          agentInstance.pfx = opts.pfx;
        }
        if (opts.passphrase) {
          agentInstance.passphrase = opts.passphrase;
        }
        return agentInstance;
      }
    ),
}));

const { default: httpsProxyAgent } = await import("https-proxy-agent");

jest.unstable_mockModule("@kintone/rest-api-client", () => ({
  KintoneRestAPIClient: jest.fn<(...args: any[]) => any>(),
}));

const { KintoneRestAPIClient } = await import("@kintone/rest-api-client");

const { buildRestAPIClient } = await import("../kintone/client.js");

describe("api", () => {
  const USERNAME = "username";
  const PASSWORD = "password";
  const BASE_URL = "https://localhost";
  const API_TOKEN = "api_token";
  const PFX_FILE_PATH = "./dummy.pfx";
  const PFX_FILE_PASSWORD = "pfx_password";
  const HTTPS_PROXY = "http://proxy.example.com:3128";

  it("should pass username and password to the apiClient correctly", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: new https.Agent(),
      proxy: false,
    });
  });

  it("should pass guestSpaceId to the apiClient correctly", () => {
    const GUEST_SPACE_ID = "1";

    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      guestSpaceId: GUEST_SPACE_ID,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      guestSpaceId: GUEST_SPACE_ID,
      userAgent: expectedUa,
      httpsAgent: new https.Agent(),
      proxy: false,
    });
  });

  it("should pass apiToken to the apiClient correctly", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      apiToken: API_TOKEN,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: { apiToken: API_TOKEN },
      userAgent: expectedUa,
      httpsAgent: new https.Agent(),
      proxy: false,
    });
  });

  it("should prioritize username and password over apiToken", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      apiToken: API_TOKEN,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: new https.Agent(),
      proxy: false,
    });
  });

  it("should pass basic auth params to the apiClient correctly", () => {
    const BASIC_AUTH_USERNAME = "basic_auth_username";
    const BASIC_AUTH_PASSWORD = "basic_auth_password";
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      basicAuthUsername: BASIC_AUTH_USERNAME,
      basicAuthPassword: BASIC_AUTH_PASSWORD,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      basicAuth: {
        username: BASIC_AUTH_USERNAME,
        password: BASIC_AUTH_PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: new https.Agent(),
      proxy: false,
    });
  });

  it("should pass information of client certificate to the apiClient correctly", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      pfxFilePath: PFX_FILE_PATH,
      pfxFilePassword: PFX_FILE_PASSWORD,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: new https.Agent({
        pfx: "dummy",
        passphrase: PFX_FILE_PASSWORD,
      }),
      proxy: false,
    });
  });

  it("should pass information of proxy server to the apiClient correctly", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      httpsProxy: HTTPS_PROXY,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: httpsProxyAgent({
        protocol: "http:",
        host: "proxy.example.com",
        port: "3128",
      }),
      proxy: false,
    });
  });

  it("should pass information of client certificate and proxy server to the apiClient correctly", () => {
    const apiClient = buildRestAPIClient({
      baseUrl: BASE_URL,
      username: USERNAME,
      password: PASSWORD,
      pfxFilePath: PFX_FILE_PATH,
      pfxFilePassword: PFX_FILE_PASSWORD,
      httpsProxy: HTTPS_PROXY,
    });
    expect(apiClient).toBeInstanceOf(KintoneRestAPIClient);
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: httpsProxyAgent({
        protocol: "http:",
        host: "proxy.example.com",
        port: "3128",
        pfx: "dummy",
        passphrase: PFX_FILE_PASSWORD,
      }),
      proxy: false,
    });
  });
});

import { vi } from "vitest";
import { buildRestAPIClient } from "../kintone/client";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import * as https from "https";
import fs from "fs";
import { HttpsProxyAgent } from "https-proxy-agent";
import type { HttpsProxyAgentOptions } from "https-proxy-agent";
const packageJson = require("../../package.json");
const expectedUa = `${packageJson.name}@${packageJson.version}`;

vi.mock("@kintone/rest-api-client");

vi.mock("fs");
vi.spyOn(fs, "readFileSync").mockReturnValue("dummy");

vi.mock("https", () => {
  return {
    Agent: vi
      .fn()
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
        },
      ),
  };
});

vi.mock("https-proxy-agent", () => {
  return {
    HttpsProxyAgent: vi
      .fn()
      .mockImplementation(
        (
          proxy: URL | string,
          opts?: { pfx?: Buffer | string; passphrase?: string },
        ) => {
          if (!opts || !opts?.pfx) {
            return { proxy };
          }

          return { proxy, opts };
        },
      ),
  };
});

describe("api", () => {
  const USERNAME = "username";
  const PASSWORD = "password";
  const BASE_URL = "https://localhost";
  const API_TOKEN = "api_token";
  const PFX_FILE_PATH = "./dummy.pfx";
  const PFX_FILE_PASSWORD = "pfx_password";
  const HTTPS_PROXY = "http://proxy.example.com:3128";
  const DEFAULT_SOCKET_TIMEOUT = 600000;

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
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
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
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
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
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
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
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
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
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
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
      httpsAgent: new HttpsProxyAgent("http://proxy.example.com:3128"),
      proxy: false,
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
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
    const proxyOptions: HttpsProxyAgentOptions<string> = {
      pfx: "dummy",
      passphrase: PFX_FILE_PASSWORD,
    };
    expect(KintoneRestAPIClient).toHaveBeenCalledWith({
      baseUrl: BASE_URL,
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      userAgent: expectedUa,
      httpsAgent: new HttpsProxyAgent(
        "http://proxy.example.com:3128",
        proxyOptions,
      ),
      proxy: false,
      socketTimeout: DEFAULT_SOCKET_TIMEOUT,
    });
  });
});

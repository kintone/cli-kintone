import { buildRestAPIClient } from "../kintone/client";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import * as https from "https";
import fs from "fs";
const packageJson = require("../../package.json");
const expectedUa = `${packageJson.name}@${packageJson.version}`;

jest.mock("@kintone/rest-api-client");

jest.mock("fs");
jest.spyOn(fs, "readFileSync").mockReturnValue("dummy");

jest.mock("https", () => {
  return {
    Agent: jest
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
        }
      ),
  };
});

jest.mock("https-proxy-agent", () => {
  return {
    Agent: jest
      .fn()
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
  };
});

describe("api", () => {
  const USERNAME = "username";
  const PASSWORD = "password";
  const BASE_URL = "https://localhost";
  const API_TOKEN = "api_token";
  const PFX_FILE_PATH = "./dummy.pfx";
  const PFX_FILE_PASSWORD = "pfx_password";

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
    });
  });
});

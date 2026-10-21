import { vi } from "vitest";
import { checkRejectArg } from "./cliHelper";

vi.setConfig({ testTimeout: 30000 });

// Remove auth env vars to test auth validation
const envWithoutAuth = (() => {
  const {
    KINTONE_USERNAME: _u,
    KINTONE_PASSWORD: _p,
    KINTONE_API_TOKEN: _t,
    ...rest
  } = process.env;
  return rest as NodeJS.ProcessEnv;
})();

describe("record import", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "record import --base-url https://example.com --app 1 --file-path /tmp/test.csv",
      errorMessage: /Authentication required \(login or API token\)/,
    });
  });
});

describe("record export", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "record export --base-url https://example.com --app 1",
      errorMessage: /Authentication required \(login or API token\)/,
    });
  });
});

describe("record delete", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "record delete --base-url https://example.com --app 1 --yes",
      errorMessage: /Authentication required \(API token\)/,
    });
  });

  it("should reject --username with auth required error", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "record delete --base-url https://example.com --app 1 --yes --username user",
      errorMessage: /Authentication required \(API token\)/,
    });
  });
});

describe("plugin upload", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "plugin upload --base-url https://example.com --input /tmp/plugin.zip",
      errorMessage: /Authentication required \(login\)/,
    });
  });

  it("should reject --api-token with auth required error", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "plugin upload --base-url https://example.com --input /tmp/plugin.zip --api-token xxx",
      errorMessage: /Authentication required \(login\)/,
    });
  });
});

describe("customize apply", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "customize apply --base-url https://example.com --app 1 --input /tmp/manifest.json",
      errorMessage: /Authentication required \(login\)/,
    });
  });
});

describe("customize export", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      env: envWithoutAuth,
      arg: "customize export --base-url https://example.com --app 1",
      errorMessage: /Authentication required \(login\)/,
    });
  });
});

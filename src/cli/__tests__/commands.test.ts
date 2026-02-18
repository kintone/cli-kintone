import { vi } from "vitest";
import childProcess from "child_process";
import { promisify } from "util";
import path from "path";

const projectRoot = path.resolve(__dirname, "../../../");
const exec = promisify(childProcess.exec);
const packageJson = require(path.resolve(projectRoot, "package.json"));
const mainFilePath = path.resolve(projectRoot, packageJson.bin["cli-kintone"]);

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

const checkRejectArg = ({
  arg,
  errorMessage,
}: {
  arg: string;
  errorMessage: string | RegExp;
}) => {
  return expect(
    exec(`cross-env LC_ALL='en_US' node ${mainFilePath} ${arg}`, {
      env: envWithoutAuth,
    }),
  ).rejects.toThrow(errorMessage);
};

describe("record import", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "record import --base-url https://example.com --app 1 --file-path /tmp/test.csv",
      errorMessage: /Authentication required \(login or API token\)/,
    });
  });
});

describe("record export", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "record export --base-url https://example.com --app 1",
      errorMessage: /Authentication required \(login or API token\)/,
    });
  });
});

describe("record delete", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "record delete --base-url https://example.com --app 1 --yes",
      errorMessage: /Authentication required \(API token\)/,
    });
  });

  it("should reject --username with auth required error", () => {
    return checkRejectArg({
      arg: "record delete --base-url https://example.com --app 1 --yes --username user",
      errorMessage: /Authentication required \(API token\)/,
    });
  });
});

describe("plugin upload", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "plugin upload --base-url https://example.com --input /tmp/plugin.zip",
      errorMessage: /Authentication required \(login\)/,
    });
  });

  it("should reject --api-token with auth required error", () => {
    return checkRejectArg({
      arg: "plugin upload --base-url https://example.com --input /tmp/plugin.zip --api-token xxx",
      errorMessage: /Authentication required \(login\)/,
    });
  });
});

describe("customize apply", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "customize apply --base-url https://example.com --app 1 --input /tmp/manifest.json",
      errorMessage: /Authentication required \(login\)/,
    });
  });
});

describe("customize export", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "customize export --base-url https://example.com --app 1",
      errorMessage: /Authentication required \(login\)/,
    });
  });
});

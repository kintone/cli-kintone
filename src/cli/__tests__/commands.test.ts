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
      errorMessage: /Either username .* or API token .* is required/,
    });
  });
});

describe("record export", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "record export --base-url https://example.com --app 1",
      errorMessage: /Either username .* or API token .* is required/,
    });
  });
});

describe("record delete", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "record delete --base-url https://example.com --app 1 --yes",
      errorMessage: /API token is required/,
    });
  });

  it("should reject --username as unknown argument", () => {
    return checkRejectArg({
      arg: "record delete --base-url https://example.com --app 1 --yes --username user",
      errorMessage: /Unknown argument: username/,
    });
  });
});

describe("plugin upload", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "plugin upload --base-url https://example.com --input /tmp/plugin.zip",
      errorMessage: /Username and password are required/,
    });
  });
});

describe("customize apply", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "customize apply --base-url https://example.com --app 1 --input /tmp/manifest.json",
      errorMessage: /Username and password are required/,
    });
  });
});

describe("customize export", () => {
  it("should reject when no auth is provided", () => {
    return checkRejectArg({
      arg: "customize export --base-url https://example.com --app 1",
      errorMessage: /Username and password are required/,
    });
  });
});

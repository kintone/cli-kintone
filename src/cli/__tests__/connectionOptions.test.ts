import type yargs from "yargs";
import yargsFactory from "yargs";
import {
  withPasswordAuth,
  withApiTokenAuth,
  withEitherAuth,
} from "../connectionOptions";

const buildParser = (
  builder: (args: yargs.Argv) => yargs.Argv,
  args: string[],
) => {
  return builder(yargsFactory(args))
    .option("base-url", { default: "https://example.com" })
    .exitProcess(false)
    .fail((msg, err) => {
      throw err || new Error(msg);
    });
};

describe("withPasswordAuth", () => {
  it("should accept when username and password are provided", () => {
    expect(() =>
      buildParser(withPasswordAuth, [
        "--username",
        "user",
        "--password",
        "pw",
      ]).parseSync(),
    ).not.toThrow();
  });

  it("should reject when only username is provided", () => {
    expect(() =>
      buildParser(withPasswordAuth, ["--username", "user"]).parseSync(),
    ).toThrow("Password is required (--password or KINTONE_PASSWORD)");
  });

  it("should reject when only password is provided", () => {
    expect(() =>
      buildParser(withPasswordAuth, ["--password", "pw"]).parseSync(),
    ).toThrow("Username is required (--username or KINTONE_USERNAME)");
  });

  it("should reject when no auth is provided", () => {
    expect(() => buildParser(withPasswordAuth, []).parseSync()).toThrow(
      "Username and password are required (--username or KINTONE_USERNAME, --password or KINTONE_PASSWORD)",
    );
  });
});

describe("withApiTokenAuth", () => {
  it("should accept when api-token is provided", () => {
    expect(() =>
      buildParser(withApiTokenAuth, ["--api-token", "token"]).parseSync(),
    ).not.toThrow();
  });

  it("should reject when no auth is provided", () => {
    expect(() => buildParser(withApiTokenAuth, []).parseSync()).toThrow(
      "API token is required (--api-token or KINTONE_API_TOKEN)",
    );
  });
});

describe("withEitherAuth", () => {
  it("should accept when username and password are provided", () => {
    expect(() =>
      buildParser(withEitherAuth, [
        "--username",
        "user",
        "--password",
        "pw",
      ]).parseSync(),
    ).not.toThrow();
  });

  it("should accept when only api-token is provided", () => {
    expect(() =>
      buildParser(withEitherAuth, ["--api-token", "token"]).parseSync(),
    ).not.toThrow();
  });

  it("should accept when both are provided and clear api-token", async () => {
    const argv = await buildParser(withEitherAuth, [
      "--username",
      "user",
      "--password",
      "pw",
      "--api-token",
      "token",
    ]).parse();

    expect(argv.username).toBe("user");
    expect(argv["api-token"]).toBeUndefined();
  });

  it("should reject when only username is provided without password", () => {
    expect(() =>
      buildParser(withEitherAuth, ["--username", "user"]).parseSync(),
    ).toThrow("Password is required (--password or KINTONE_PASSWORD)");
  });

  it("should reject when no auth is provided", () => {
    expect(() => buildParser(withEitherAuth, []).parseSync()).toThrow(
      "Either username (--username) or API token (--api-token) is required",
    );
  });
});

import yargsFactory from "yargs";
import { buildConnectionOptions } from "../connectionOptions";

const buildParser = (
  config: Parameters<typeof buildConnectionOptions>[1],
  args: string[],
) => {
  return buildConnectionOptions(yargsFactory(args), config)
    .option("base-url", { default: "https://example.com" })
    .exitProcess(false)
    .fail((msg, err) => {
      throw err || new Error(msg);
    });
};

describe("buildConnectionOptions with password auth", () => {
  const config = { auth: ["password"] } as const;

  it("should accept when username and password are provided", () => {
    expect(() =>
      buildParser(config, [
        "--username",
        "user",
        "--password",
        "pw",
      ]).parseSync(),
    ).not.toThrow();
  });

  it("should reject when only username is provided", () => {
    expect(() =>
      buildParser(config, ["--username", "user"]).parseSync(),
    ).toThrow("Authentication required (login)");
  });

  it("should reject when only password is provided", () => {
    expect(() => buildParser(config, ["--password", "pw"]).parseSync()).toThrow(
      "Authentication required (login)",
    );
  });

  it("should reject when no auth is provided", () => {
    expect(() => buildParser(config, []).parseSync()).toThrow(
      "Authentication required (login)",
    );
  });
});

describe("buildConnectionOptions with apiToken auth", () => {
  const config = { auth: ["apiToken"] } as const;

  it("should accept when api-token is provided", () => {
    expect(() =>
      buildParser(config, ["--api-token", "token"]).parseSync(),
    ).not.toThrow();
  });

  it("should reject when no auth is provided", () => {
    expect(() => buildParser(config, []).parseSync()).toThrow(
      "Authentication required (API token)",
    );
  });
});

describe("buildConnectionOptions with either auth", () => {
  const config = { auth: ["password", "apiToken"] } as const;

  it("should accept when username and password are provided", () => {
    expect(() =>
      buildParser(config, [
        "--username",
        "user",
        "--password",
        "pw",
      ]).parseSync(),
    ).not.toThrow();
  });

  it("should accept when only api-token is provided", () => {
    expect(() =>
      buildParser(config, ["--api-token", "token"]).parseSync(),
    ).not.toThrow();
  });

  it("should accept when both are provided and clear api-token", async () => {
    const argv = await buildParser(config, [
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
      buildParser(config, ["--username", "user"]).parseSync(),
    ).toThrow("Authentication required (login or API token)");
  });

  it("should reject when no auth is provided", () => {
    expect(() => buildParser(config, []).parseSync()).toThrow(
      "Authentication required (login or API token)",
    );
  });
});

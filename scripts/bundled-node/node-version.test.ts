import { buildPkgTargets, parseNodeVersion } from "./node-version";

describe("parseNodeVersion", () => {
  it("should return a full version", () => {
    expect(parseNodeVersion("26.1.0")).toBe("26.1.0");
  });

  it("should ignore surrounding whitespace and the trailing newline", () => {
    expect(parseNodeVersion(" 26.1.0 \n")).toBe("26.1.0");
  });

  it.each([
    ["a major version only", "26"],
    ["a version without the patch", "26.1"],
    ["a version with the v prefix", "v26.1.0"],
    ["an alias", "lts/*"],
    ["a prerelease version", "26.1.0-rc.1"],
    ["multiple lines", "26.1.0\n26.2.0"],
    ["an empty content", ""],
  ])("should reject %s", (_description, content) => {
    expect(() => parseNodeVersion(content)).toThrow(
      `.node-version must contain a full Node.js version such as 26.1.0, but got "${content.trim()}"`,
    );
  });
});

describe("buildPkgTargets", () => {
  it("should pin every target to the given version", () => {
    expect(buildPkgTargets("26.1.0")).toBe(
      "node26.1.0-linux-x64,node26.1.0-macos-arm64,node26.1.0-win-x64",
    );
  });
});

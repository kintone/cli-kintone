import { PluginManifestValidationError } from "../../pack/error";

describe("PluginManifestValidationError", () => {
  it("should return error message", () => {
    const error = new PluginManifestValidationError([
      '"/icon" must match format "relative-path"',
      '"/desktop/js/1" must match a schema in anyOf',
    ]);

    expect(error.toString()).toBe(
      [
        "Invalid manifest.json:",
        '- "/icon" must match format "relative-path"',
        '- "/desktop/js/1" must match a schema in anyOf',
        "",
      ].join("\n"),
    );
  });
});

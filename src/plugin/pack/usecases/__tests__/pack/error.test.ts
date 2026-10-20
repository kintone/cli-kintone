import {
  PluginManifestFileNotFoundError,
  PluginManifestValidationError,
  PrivateKeyFileNotFoundError,
} from "../../pack/error";

describe("PluginManifestFileNotFoundError", () => {
  it("should return error message", () => {
    const error = new PluginManifestFileNotFoundError("/path/to/manifest.json");

    expect(error.toString()).toBe(
      "Failed to pack the plugin.\nManifest file not found: /path/to/manifest.json\n",
    );
  });
});

describe("PrivateKeyFileNotFoundError", () => {
  it("should return error message", () => {
    const error = new PrivateKeyFileNotFoundError("/path/to/private.ppk");

    expect(error.toString()).toBe(
      "Failed to pack the plugin.\nPrivate key file not found: /path/to/private.ppk\n",
    );
  });
});

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

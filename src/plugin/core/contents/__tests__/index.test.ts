import path from "path";
import { ManifestFactory } from "../../manifest";
import { ContentsZip } from "../index";
import { LocalFSDriver } from "../../driver";
import fs from "fs";

const fixturesDir = path.join(__dirname, "fixtures");

describe("ContentsZip", () => {
  describe("should be able to create ContentsZip from a plugin directory", () => {
    it("manifest v1", async () => {
      const pluginDir = path.join(fixturesDir, "plugin-manifest-v1");

      const manifestJSONPath = path.join(pluginDir, "manifest.json");
      const manifest = await ManifestFactory.loadJsonFile(manifestJSONPath);

      const contentsZip = await ContentsZip.createFromManifest(
        manifest,
        new LocalFSDriver(pluginDir),
      );
      const files = await contentsZip.fileList();
      expect(files).toStrictEqual(["manifest.json", "image/icon.png"]);
      expect(contentsZip).toBeInstanceOf(ContentsZip);
      expect(contentsZip.buffer).toBeInstanceOf(Buffer);
    });

    it("manifest v2", async () => {
      const pluginDir = path.join(fixturesDir, "plugin-manifest-v2");

      const manifestJSONPath = path.join(pluginDir, "manifest.json");
      const manifest = await ManifestFactory.loadJsonFile(manifestJSONPath);

      const contentsZip = await ContentsZip.createFromManifest(
        manifest,
        new LocalFSDriver(pluginDir),
      );

      const expectedFiles = [
        "manifest.json",
        "image/icon.png",
        "js/customize.js",
        "css/customize.css",
        "html/customize.html",
        "html/config.html",
        "js/config.js",
        "css/config.css",
      ];
      const files = await contentsZip.fileList();
      expect(files).toStrictEqual(expectedFiles);
      expect(contentsZip).toBeInstanceOf(ContentsZip);
      expect(contentsZip.buffer).toBeInstanceOf(Buffer);
    });
  });

  describe("invalid contents.zip", () => {
    const invalidMaxFileSizeContentsZipPath = path.join(
      __dirname,
      "fixtures",
      "invalid-maxFileSize",
      "invalid-maxFileSize-contents.zip",
    );

    // TODO: This test must be in contents-zip module
    it("throws an error if the contents.zip is invalid", async () => {
      const buffer = fs.readFileSync(invalidMaxFileSizeContentsZipPath);
      await expect(ContentsZip.fromBuffer(buffer)).rejects.toThrow(
        '"/icon" file size should be <= 20MB',
      );
    });
  });
});

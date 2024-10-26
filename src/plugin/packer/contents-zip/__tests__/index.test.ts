import path from "path";
import { ManifestFactory } from "../../manifest";
import { ContentsZip } from "../index";
import { LocalFSDriver } from "../../driver";

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
});

import path from "path";
import { ManifestFactory } from "../../manifest";
import { ContentsZip } from "../index";

const fixturesDir = path.join(__dirname, "fixtures");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("ContentsZip", () => {
  it("should be able to create ContentsZip from a plugin directory", async () => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const manifest = await ManifestFactory.loadJsonFile(manifestJSONPath);

    const contentsZip = await ContentsZip.createFromManifest(
      pluginDir,
      manifest,
    );
    const files = await contentsZip.fileList();
    expect(files).toStrictEqual(["manifest.json", "image/icon.png"]);
    expect(contentsZip).toBeInstanceOf(ContentsZip);
    expect(contentsZip.buffer).toBeInstanceOf(Buffer);
  });
});

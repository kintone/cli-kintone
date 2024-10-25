import path from "path";
import { readZipContentsNames } from "../../__tests__/helpers/zip";
import { createContentsZip } from "../create-contents-zip";
import { ManifestV1 } from "../../manifest";

const fixturesDir = path.join(__dirname, "fixtures");
const pluginDir = path.join(fixturesDir, "sample-plugin", "plugin-dir");

describe("create-contents-zip", () => {
  it("should be able to create buffer from a plugin directory", async () => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const manifest = await ManifestV1.loadJsonFile(manifestJSONPath);

    const buffer = await createContentsZip(pluginDir, manifest);
    const files = await readZipContentsNames(buffer as Buffer);
    expect(files).toStrictEqual(["manifest.json", "image/icon.png"]);
    expect(buffer).toBeInstanceOf(Buffer);
  });
});

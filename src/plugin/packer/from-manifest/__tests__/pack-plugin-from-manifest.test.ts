import path from "path";
import fs from "fs";
import packer from "../../index";
import { packPluginFromManifest } from "../pack-plugin-from-manifest";
import { ManifestFactory } from "../../manifest";
import { ContentsZip } from "../../contents-zip";

const fixturesDir = path.join(__dirname, "fixtures");
const ppkFilePath = path.join(fixturesDir, "private.ppk");
const pluginDir = path.join(fixturesDir, "sample-plugin");

describe("pack-plugin-from-manifest", () => {
  it("should be able to create a plugin from the manifest json path", async () => {
    const manifestJSONPath = path.join(pluginDir, "manifest.json");
    const privateKey = fs.readFileSync(ppkFilePath, "utf-8");
    const manifest = await ManifestFactory.loadJsonFile(manifestJSONPath);

    const result1 = await packPluginFromManifest(manifestJSONPath, privateKey);
    const contentsZip = await ContentsZip.createFromManifest(
      pluginDir,
      manifest,
    );
    const result2 = await packer(contentsZip, privateKey);

    expect(result1.id).toBe(result2.id);
    expect(result1.plugin.buffer.length).toBe(result2.plugin.buffer.length);
    expect(result1.privateKey).toBe(result2.privateKey);

    const files = await result1.plugin.fileList();
    expect(files).toStrictEqual(["contents.zip", "PUBKEY", "SIGNATURE"]);
  });
});

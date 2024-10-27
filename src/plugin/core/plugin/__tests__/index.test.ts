import path from "path";
import fs from "fs";

import type { PluginInterface } from "../index";
import { PluginZip } from "../index";
import { PrivateKey, PublicKey } from "../../crypto";
import { ContentsZip } from "../../contents";

const contentsZipPath = path.join(__dirname, "fixtures", "contents.zip");

describe("PluginZip", () => {
  let pluginZip: PluginZip;
  beforeEach(async () => {
    const contentsZip = await ContentsZip.fromBuffer(
      fs.readFileSync(contentsZipPath),
    );
    const key = PrivateKey.generateKey();
    pluginZip = await PluginZip.buildFromContentsZip(contentsZip, key);
  });

  it("the zip contains 3 files", async () => {
    const files = await pluginZip.fileList();
    expect(files.sort()).toStrictEqual(
      ["contents.zip", "PUBKEY", "SIGNATURE"].sort(),
    );
  });

  it("the zip passes signature verification", async () => {
    await verifyPlugin(pluginZip);
  });
});

const verifyPlugin = async (plugin: PluginInterface): Promise<void> => {
  const publicKeyBuffer = await plugin.readFile("PUBKEY");
  const publicKey = PublicKey.importKey(publicKeyBuffer);

  const contentsZip = await plugin.readFile("contents.zip");
  const signature = await plugin.readFile("SIGNATURE");

  expect(publicKey.verify(contentsZip, signature)).toBe(true);
};

import { Given, Then } from "../utils/world";
import * as assert from "assert";
import fs from "fs";
import path from "path";

Then("I have a file at {string}", async function (filePath: string) {
  assert.ok(await this.isFileExists(filePath));
});

const assetsRootPath = path.resolve(__dirname, "..", "assets");

/**
 * アセットキーと実ファイル／ディレクトリの対応表
 */
const assetMap: Record<string, string | undefined> = {
  plugin_project: path.resolve(assetsRootPath, "plugin_project"),
};

Given("An asset {string} exists", async function (assetName: string) {
  const srcPath = assetMap[assetName];
  if (!srcPath) {
    throw new Error(`Unknown asset key: ${assetName}`);
  }

  const destPath = path.resolve(this.workingDir, assetName);
  await copyAsset(srcPath, destPath);
});

const copyAsset = async (srcPath: string, destPath: string) => {
  const stats = await fs.promises.stat(srcPath);

  if (stats.isDirectory()) {
    await fs.promises.mkdir(destPath, { recursive: true });
    const entries = await fs.promises.readdir(srcPath);

    for (const entry of entries) {
      const src = path.join(srcPath, entry);
      const dest = path.join(destPath, entry);
      await copyAsset(src, dest); // 再帰的コピー
    }
  } else {
    await fs.promises.copyFile(srcPath, destPath);
  }
};

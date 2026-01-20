import { Given, Then } from "../utils/world";
import * as assert from "assert";
import fs from "fs";
import path from "path";

Then("I have a file at {string}", async function (filePath: string) {
  assert.ok(await this.isFileExists(filePath));
});

Then("I have a directory at {string}", async function (dirPath: string) {
  // Debug: print working directory and its contents
  const fullPath = path.join(this.workingDir, dirPath);

  console.log("=== DEBUG INFO ===");
  console.log("Working directory:", this.workingDir);
  console.log("Looking for directory:", fullPath);
  try {
    const contents = await fs.promises.readdir(this.workingDir);
    console.log("Working directory contents:", contents);
  } catch (err) {
    console.log("Error reading working directory:", err);
  }
  console.log("=== STDOUT ===");
  console.log(this.response.stdout.toString());
  console.log("=== STDERR ===");
  console.log(this.response.stderr.toString());
  console.log("=== END DEBUG ===");

  assert.ok(await this.isDirectoryExists(dirPath));
});

Given("The directory {string} exists", async function (dirPath: string) {
  await this.generateDirectory(dirPath);
});

const assetsRootPath = path.resolve(__dirname, "..", "assets");

/**
 * アセットキーと実ファイル／ディレクトリの対応表
 */
const assetMap: Record<string, string | undefined> = {
  plugin_project: path.resolve(assetsRootPath, "plugin_project"),
  "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip": path.resolve(
    assetsRootPath,
    "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip",
  ),
  "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v2.zip": path.resolve(
    assetsRootPath,
    "plugin_chjjmgadianhfiopehkbjlfkfioglafk_v2.zip",
  ),
};

Given(
  "An asset with key {string} is available as {string}",
  async function (assetKey: string, destName: string) {
    const srcPath = assetMap[assetKey];
    if (!srcPath) {
      throw new Error(`Unknown asset key: ${assetKey}`);
    }

    const destPath = path.resolve(this.workingDir, destName);
    await copyAsset(srcPath, destPath);
  },
);

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

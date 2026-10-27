import fs from "fs/promises";
import os from "os";
import path from "path";
import { LocalPluginRepositoryFromZipFile } from "../localPluginRepositoryFromZipFile";

const pluginZipPath = path.resolve(
  __dirname,
  "../../../upload/__tests__/fixtures/pebpcljifhnnddaohkbfehcjmaadchja.zip",
);

describe("LocalPluginRepositoryFromZipFile", () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-info-"),
    );
  });

  afterEach(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should read the plugin id and the manifest from the zip file", async () => {
    const plugin = await new LocalPluginRepositoryFromZipFile(
      pluginZipPath,
    ).read();

    expect(plugin.id).toBe("pebpcljifhnnddaohkbfehcjmaadchja");
    expect(plugin.manifest.name).toBe("hello-kintone");
  });

  it("should throw the error of the file system when the file does not exist", async () => {
    await expect(
      new LocalPluginRepositoryFromZipFile(
        path.join(workDir, "none.zip"),
      ).read(),
    ).rejects.toThrow(/ENOENT/);
  });

  it("should throw the error of the zip reader when the file is not a zip file", async () => {
    const inputPath = path.join(workDir, "broken.zip");
    await fs.writeFile(inputPath, "not a zip file", "utf8");

    await expect(
      new LocalPluginRepositoryFromZipFile(inputPath).read(),
    ).rejects.toThrow(
      "End of central directory record signature not found. Either not a zip file, or file is truncated.",
    );
  });
});

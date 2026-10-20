import { vi } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { PluginZip } from "../../../core";
import { LocalPluginZipRepositoryFromFile } from "../localPluginZipRepositoryFromFile";

const pluginPath = path.resolve(
  __dirname,
  "../../../../../features/assets/plugin_chjjmgadianhfiopehkbjlfkfioglafk_v1.zip",
);

describe("LocalPluginZipRepositoryFromFile", () => {
  let workDir: string;
  let pluginZip: PluginZip;

  beforeAll(async () => {
    pluginZip = await PluginZip.fromBuffer(await fs.readFile(pluginPath));
  });

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-pack-"),
    );
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should write the plugin to the output path and return the path", async () => {
    const outputPath = path.join(workDir, "plugin.zip");
    const repository = new LocalPluginZipRepositoryFromFile(outputPath);

    await repository.prepare();
    const savedPath = await repository.save(pluginZip);

    expect(savedPath).toBe(outputPath);
    await expect(fs.readFile(outputPath)).resolves.toStrictEqual(
      pluginZip.buffer,
    );
  });

  it("should create the directory of the output path without writing the plugin when preparing", async () => {
    const outputPath = path.join(workDir, "dist", "nested", "plugin.zip");
    const repository = new LocalPluginZipRepositoryFromFile(outputPath);

    await repository.prepare();

    await expect(fs.stat(path.dirname(outputPath))).resolves.toSatisfy(
      (stats: { isDirectory: () => boolean }) => stats.isDirectory(),
    );
    await expect(fs.access(outputPath)).rejects.toMatchObject({
      code: "ENOENT",
    });

    await repository.save(pluginZip);

    await expect(fs.readFile(outputPath)).resolves.toStrictEqual(
      pluginZip.buffer,
    );
  });

  it("should throw when the directory of the output path cannot be created", async () => {
    await fs.writeFile(path.join(workDir, "file"), "");
    const repository = new LocalPluginZipRepositoryFromFile(
      path.join(workDir, "file", "plugin.zip"),
    );

    await expect(repository.prepare()).rejects.toThrow();
  });

  it("should resolve a relative output path against the cwd", async () => {
    vi.spyOn(process, "cwd").mockReturnValue(workDir);
    const repository = new LocalPluginZipRepositoryFromFile("plugin.zip");

    await repository.prepare();
    const savedPath = await repository.save(pluginZip);

    expect(savedPath).toBe(path.join(workDir, "plugin.zip"));
    await expect(
      fs.readFile(path.join(workDir, "plugin.zip")),
    ).resolves.toStrictEqual(pluginZip.buffer);
  });
});

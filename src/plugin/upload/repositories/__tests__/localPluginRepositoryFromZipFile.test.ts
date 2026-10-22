import { vi } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import * as chokidar from "chokidar";
import { buildWatchOptions } from "../../../../utils/watch";
import { LocalPluginRepositoryFromZipFile } from "../localPluginRepositoryFromZipFile";

const on = vi.fn();
vi.mock("chokidar", () => ({ watch: vi.fn(() => ({ on })) }));

const pluginZipPath = path.resolve(
  __dirname,
  "../../__tests__/fixtures/pebpcljifhnnddaohkbfehcjmaadchja.zip",
);

describe("LocalPluginRepositoryFromZipFile", () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-upload-"),
    );
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should read the file path, the plugin id, the manifest and the content of the zip file", async () => {
    const plugin = await new LocalPluginRepositoryFromZipFile(
      pluginZipPath,
    ).read();

    expect(plugin.filePath).toBe(pluginZipPath);
    expect(plugin.id).toBe("pebpcljifhnnddaohkbfehcjmaadchja");
    expect(plugin.manifest.name).toBe("hello-kintone");
    expect(plugin.buffer).toStrictEqual(await fs.readFile(pluginZipPath));
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

  describe("watch", () => {
    it("should watch the zip file", () => {
      const onChange = vi.fn();

      new LocalPluginRepositoryFromZipFile(pluginZipPath).watch(onChange);

      expect(chokidar.watch).toHaveBeenCalledWith(
        pluginZipPath,
        buildWatchOptions(),
      );
      expect(on).toHaveBeenCalledWith("change", onChange);
    });
  });
});

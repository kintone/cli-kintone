import { vi } from "vitest";
import * as chokidar from "chokidar";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { PrivateKey } from "../../../core";
import { buildWatchOptions } from "../../../../utils/watch";
import { LocalPluginProjectRepositoryFromFiles } from "../localPluginProjectRepositoryFromFiles";

const { on } = vi.hoisted(() => ({ on: vi.fn() }));
vi.mock("chokidar", () => ({ watch: vi.fn(() => ({ on })) }));

const fixturesDir = path.resolve(__dirname, "../../__tests__/fixtures");
const manifestPath = path.join(
  fixturesDir,
  "plugin-full-manifest",
  "manifest.json",
);
const privateKeyPath = path.join(fixturesDir, "private.ppk");

describe("LocalPluginProjectRepositoryFromFiles", () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-pack-"),
    );
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(workDir, { recursive: true, force: true });
  });

  describe("read", () => {
    it("should return the manifest and the source files next to it", async () => {
      const { manifest, sources } =
        await new LocalPluginProjectRepositoryFromFiles({
          manifestPath,
          privateKeyPath,
        }).read();

      expect(manifest.name).toBe("sample plugin");
      expect(manifest.manifestFileName).toBe("manifest.json");
      await expect(sources.readFile("js/desktop.js", "utf-8")).resolves.toBe(
        await fs.readFile(
          path.join(fixturesDir, "plugin-full-manifest", "js", "desktop.js"),
          "utf8",
        ),
      );
    });

    it("should throw an error when the manifest does not exist", async () => {
      const missingManifestPath = path.join(workDir, "manifest.json");

      await expect(
        new LocalPluginProjectRepositoryFromFiles({
          manifestPath: missingManifestPath,
          privateKeyPath: path.join(workDir, "none.ppk"),
        }).read(),
      ).rejects.toThrow(`Manifest file not found: ${missingManifestPath}`);
    });

    it("should throw an error before parsing the manifest when the private key does not exist", async () => {
      const brokenManifestPath = path.join(workDir, "manifest.json");
      await fs.writeFile(brokenManifestPath, "{bad", "utf8");
      const missingPrivateKeyPath = path.join(workDir, "none.ppk");

      await expect(
        new LocalPluginProjectRepositoryFromFiles({
          manifestPath: brokenManifestPath,
          privateKeyPath: missingPrivateKeyPath,
        }).read(),
      ).rejects.toThrow(`Private key file not found: ${missingPrivateKeyPath}`);
    });

    it("should resolve relative paths against the cwd", async () => {
      vi.spyOn(process, "cwd").mockReturnValue(fixturesDir);

      const { manifest } = await new LocalPluginProjectRepositoryFromFiles({
        manifestPath: "plugin-full-manifest/manifest.json",
        privateKeyPath: "private.ppk",
      }).read();

      expect(manifest.name).toBe("sample plugin");
    });
  });

  describe("readPrivateKey", () => {
    it("should return the private key in the file", async () => {
      const privateKey = await new LocalPluginProjectRepositoryFromFiles({
        manifestPath,
        privateKeyPath,
      }).readPrivateKey();

      expect(privateKey.uuid()).toBe(
        PrivateKey.importKey(await fs.readFile(privateKeyPath, "utf8")).uuid(),
      );
    });
  });

  describe("watch", () => {
    it("should watch the manifest and the local source files", async () => {
      const repository = new LocalPluginProjectRepositoryFromFiles({
        manifestPath,
        privateKeyPath,
      });
      const { manifest } = await repository.read();
      const onChange = vi.fn();

      repository.watch(manifest, onChange);

      const sourceDir = path.dirname(manifestPath);
      expect(chokidar.watch).toHaveBeenCalledWith(
        [
          manifestPath,
          ...manifest.sourceList().map((src) => path.resolve(sourceDir, src)),
        ],
        buildWatchOptions(),
      );
      expect(on).toHaveBeenCalledWith("change", onChange);
    });
  });
});

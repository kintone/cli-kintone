import fs from "fs/promises";
import path from "path";
import * as chokidar from "chokidar";
import type { ManifestInterface } from "../../core";
import { LocalFSDriver, ManifestFactory, PrivateKey } from "../../core";
import type {
  LocalPluginProject,
  LocalPluginProjectRepository,
} from "../usecases/interface";
import { isFile } from "../../../utils/file";
import { logger } from "../../../utils/log";
import { buildWatchOptions } from "../../../utils/watch";

export class LocalPluginProjectRepositoryFromFiles implements LocalPluginProjectRepository {
  private readonly manifestPath: string;
  private readonly privateKeyPath: string;
  private readonly sourceDir: string;
  private readonly sources: LocalFSDriver;

  constructor(options: { manifestPath: string; privateKeyPath: string }) {
    this.manifestPath = path.resolve(options.manifestPath);
    this.privateKeyPath = path.resolve(options.privateKeyPath);
    this.sourceDir = path.dirname(this.manifestPath);
    this.sources = new LocalFSDriver(this.sourceDir);
  }

  async read(): Promise<LocalPluginProject> {
    // Both files are checked before either is parsed, so a missing file is reported before a broken one.
    if (!(await isFile(this.manifestPath))) {
      throw new Error(`Manifest file not found: ${this.manifestPath}`);
    }
    if (!(await isFile(this.privateKeyPath))) {
      throw new Error(`Private key file not found: ${this.privateKeyPath}`);
    }

    const manifest = await ManifestFactory.loadJsonFile(
      this.manifestPath,
      this.sources,
    );
    return { manifest, sources: this.sources };
  }

  async readPrivateKey(): Promise<PrivateKey> {
    logger.debug(`loading an existing key: ${this.privateKeyPath}`);
    const privateKey = await fs.readFile(this.privateKeyPath, "utf8");
    return PrivateKey.importKey(privateKey);
  }

  watch(manifest: ManifestInterface, onChange: () => void): void {
    const watchTargets = [
      this.manifestPath,
      ...manifest.sourceList().map((src) => path.resolve(this.sourceDir, src)),
    ];
    chokidar.watch(watchTargets, buildWatchOptions()).on("change", onChange);
  }
}

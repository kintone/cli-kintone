import fs from "fs/promises";
import * as chokidar from "chokidar";
import { PluginZip } from "../../core";
import type { LocalPlugin, LocalPluginRepository } from "../usecases/interface";
import { buildWatchOptions } from "../../../utils/watch";

export class LocalPluginRepositoryFromZipFile implements LocalPluginRepository {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async read(): Promise<LocalPlugin> {
    const buffer = await fs.readFile(this.filePath);
    const pluginZip = await PluginZip.fromBuffer(buffer);
    const id = await pluginZip.getPluginID();
    const manifest = await pluginZip.manifest();
    return { filePath: this.filePath, id, manifest, buffer };
  }

  watch(onChange: () => void): void {
    chokidar.watch(this.filePath, buildWatchOptions()).on("change", onChange);
  }
}

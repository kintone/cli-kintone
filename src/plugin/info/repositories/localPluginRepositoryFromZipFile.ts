import fs from "fs/promises";
import { PluginZip } from "../../core";
import type { LocalPlugin, LocalPluginRepository } from "../usecases/interface";

export class LocalPluginRepositoryFromZipFile implements LocalPluginRepository {
  private readonly input: string;

  constructor(input: string) {
    this.input = input;
  }

  async read(): Promise<LocalPlugin> {
    const buffer = await fs.readFile(this.input);
    const pluginZip = await PluginZip.fromBuffer(buffer);
    const id = await pluginZip.getPluginID();
    const manifest = await pluginZip.manifest();
    return { id, manifest };
  }
}

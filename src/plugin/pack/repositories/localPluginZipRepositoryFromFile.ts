import fs from "fs/promises";
import path from "path";
import type { PluginZip } from "../../core";
import type { LocalPluginZipRepository } from "../usecases/interface";
import { logger } from "../../../utils/log";

export class LocalPluginZipRepositoryFromFile implements LocalPluginZipRepository {
  private readonly output: string;

  constructor(output: string) {
    this.output = output;
  }

  async prepare() {
    const filePath = path.resolve(this.output);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    logger.debug(`outputFile: ${filePath}`);
  }

  async save(pluginZip: PluginZip) {
    const filePath = path.resolve(this.output);
    await fs.writeFile(filePath, pluginZip.buffer);
    return filePath;
  }
}

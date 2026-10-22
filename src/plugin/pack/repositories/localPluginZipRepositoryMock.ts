import type { PluginZip } from "../../core";
import type { LocalPluginZipRepository } from "../usecases/interface";

export class LocalPluginZipRepositoryMock implements LocalPluginZipRepository {
  readonly savedPluginZips: PluginZip[] = [];

  private readonly output: string;

  constructor(output: string) {
    this.output = output;
  }

  async prepare() {
    // Nothing to prepare.
  }

  async save(pluginZip: PluginZip) {
    this.savedPluginZips.push(pluginZip);
    return this.output;
  }
}

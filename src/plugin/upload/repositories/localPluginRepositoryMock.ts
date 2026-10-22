import type { LocalPlugin, LocalPluginRepository } from "../usecases/interface";

export class LocalPluginRepositoryMock implements LocalPluginRepository {
  private readonly plugin: LocalPlugin;

  constructor(plugin: LocalPlugin) {
    this.plugin = plugin;
  }

  async read() {
    return this.plugin;
  }
}

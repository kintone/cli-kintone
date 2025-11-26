import { Given, Then } from "../../utils/world";

Then(
  "The plugin with id {string} should be installed",
  async function (pluginId: string) {
    const plugin = await this.getPluginByPluginId(pluginId);
    if (!plugin) {
      throw new Error(`The plugin with id ${pluginId} is not installed`);
    }
  },
);

Then(
  "The plugin with id {string} and version {string} should be installed",
  async function (pluginId: string, version: string) {
    const plugin = await this.getPluginByPluginId(pluginId);
    if (!plugin) {
      throw new Error(`The plugin with id ${pluginId} is not installed`);
    }
    if (plugin.version !== version) {
      throw new Error(
        `The plugin with id ${pluginId} is installed with version ${plugin.version}, but expected version is ${version}`,
      );
    }
  },
);

Then(
  "The plugin with id {string} should not be installed",
  async function (pluginId: string) {
    const plugin = await this.getPluginByPluginId(pluginId);
    if (plugin) {
      throw new Error(`The plugin with id ${pluginId} is installed`);
    }
  },
);

Given(
  "The plugin with id {string} is not installed",
  async function (pluginId: string) {
    await this.uninstallPluginByPluginId(pluginId);
  },
);

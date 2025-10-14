import fs from "fs/promises";
import { confirm } from "@inquirer/prompts";
import { PluginZip } from "../core";
import {
  buildRestAPIClient,
  type RestAPIClientOptions,
} from "../../kintone/client";
import { logger } from "../../utils/log";
import os from "os";
import * as chokidar from "chokidar";

export type Params = {
  pluginFilePath: string;
  force: boolean;
  watch: boolean;
};

export const install = async (
  params: Params & RestAPIClientOptions,
): Promise<void> => {
  const { pluginFilePath, ...restApiClientOptions } = params;

  const apiClient = buildRestAPIClient(restApiClientOptions);

  const buffer = await fs.readFile(pluginFilePath);
  const pluginZip = await PluginZip.fromBuffer(buffer);
  const pluginId = await pluginZip.getPluginID();
  const pluginManifest = await pluginZip.manifest();

  const { plugins: installedPlugins } = await apiClient.plugin.getPlugins({
    ids: [pluginId],
  } as any);
  const installedPlugin = installedPlugins.find((p) => p.id === pluginId);
  const isInstalled = installedPlugin !== undefined;

  const installationSummary = `
  Installation Summary:
    Destination: ${restApiClientOptions.baseUrl}
    File Path: ${pluginFilePath}
    Plugin ID: ${pluginId}
    Plugin Name: ${pluginManifest.name}
    Current version: ${installedPlugin?.version ?? "(not installed)"}
    Target version: ${pluginManifest.version}`;
  logger.info(installationSummary);

  if (!params.force && !params.watch) {
    const answers = await confirm({
      message: `Do you continue to install this plugin?`,
      default: false,
    });
    if (!answers) {
      logger.info("Plugin installation aborted.");
      // TODO: ユーザーによって中止された場合のエラー
      throw new Error();
    }
  }

  const { fileKey } = await apiClient.file.uploadFile({
    file: { name: pluginFilePath, data: buffer },
  });

  if (isInstalled) {
    await apiClient.plugin.updatePlugin({ id: pluginId, fileKey });
  } else {
    await apiClient.plugin.installPlugin({ fileKey });
  }

  if (params.watch) {
    // change events are fired before changed files are flushed on Windows,
    // which generate an invalid plugin zip.
    // in order to fix this, we use awaitWriteFinish option only on Windows.
    const watchOptions =
      os.platform() === "win32"
        ? {
            awaitWriteFinish: {
              stabilityThreshold: 1000,
              pollInterval: 250,
            },
          }
        : {};
    const watcher = chokidar.watch(pluginFilePath, watchOptions);
    watcher.on("change", () => {
      install({ ...params, watch: false });
    });
  }

  logger.info("Plugin installed successfully.");
};

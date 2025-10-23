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
  force?: boolean;
  watch?: boolean;
};

export const upload = async (
  params: Params & RestAPIClientOptions,
): Promise<void> => {
  const { pluginFilePath, ...restApiClientOptions } = params;

  const apiClient = buildRestAPIClient(restApiClientOptions);

  // Read plugin zip file
  const buffer = await fs.readFile(pluginFilePath);
  const pluginZip = await PluginZip.fromBuffer(buffer);
  const pluginId = await pluginZip.getPluginID();
  const pluginManifest = await pluginZip.manifest();

  // Read plugin info from kintone
  const { plugins: installedPlugins } = await apiClient.plugin.getPlugins(
    // TODO: rest-api-client should accept array of ids
    {
      ids: [pluginId],
    } as any,
  );
  const installedPlugin = installedPlugins.find((p) => p.id === pluginId);
  const isInstalled = installedPlugin !== undefined;

  const isSameVersion = installedPlugin?.version === pluginManifest.version;

  // Show installation summary
  const installationSummary = `
  Installation Summary:
    Destination: ${restApiClientOptions.baseUrl}
    File Path: ${pluginFilePath}
    Plugin ID: ${pluginId}
    Plugin Name: ${pluginManifest.name}
    Current version: ${installedPlugin?.version ?? "(not installed)"}
    Target version: ${pluginManifest.version}${isSameVersion ? " (reinstall)" : ""}`;
  logger.info(installationSummary);

  // Get confirmation from user if required
  if (!params.force && !params.watch) {
    const answers = await confirm({
      message: `Do you want to continue?`,
      default: false,
    });
    if (!answers) {
      logger.info("Plugin installation cancelled by user.");
      return;
    }
  }

  // Upload plugin zip file to kintone
  const { fileKey } = await apiClient.file.uploadFile({
    file: { name: pluginFilePath, data: buffer },
  });

  // Install or update plugin
  if (isInstalled) {
    await apiClient.plugin.updatePlugin({ id: pluginId, fileKey });
  } else {
    await apiClient.plugin.installPlugin({ fileKey });
  }

  // Start watch mode if watch option is given
  if (params.watch) {
    // TODO: 他のコマンドとwatchモードに渡すオプションを共通化する
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
    watcher.on("change", async () => {
      await upload({ ...params, force: true, watch: false });
    });
  }

  logger.info("Plugin installed successfully.");
};

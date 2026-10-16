import fs from "fs/promises";
import { confirm } from "@inquirer/prompts";
import { PluginZip } from "../core";
import { buildPluginSummary } from "../core/summary";
import {
  buildRestAPIClient,
  type RestAPIClientOptions,
} from "../../kintone/client";
import { logger } from "../../utils/log";
import * as chokidar from "chokidar";
import path from "path";
import { isFile } from "../../utils/file";
import { buildWatchOptions } from "../../utils/watch";

export type Params = {
  pluginFilePath: string;
  force?: boolean;
  watch?: boolean;
};

export const upload = async (
  params: Params & RestAPIClientOptions,
): Promise<void> => {
  const { pluginFilePath: _, ...restApiClientOptions } = params;
  const pluginFilePath = path.resolve(params.pluginFilePath);

  if (!(await isFile(pluginFilePath))) {
    throw new Error(`Plugin file not found: ${pluginFilePath}`);
  }

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
  const summary = buildPluginSummary(pluginId, pluginManifest);
  const lines = [
    `    Destination: ${restApiClientOptions.baseUrl}`,
    `    File Path: ${pluginFilePath}`,
    `    Plugin ID: ${summary.id}`,
    `    Plugin Name: ${summary.name}`,
    `    Current version: ${installedPlugin?.version ?? "(not installed)"}`,
    `    Target version: ${summary.version}${isSameVersion ? " (reinstall)" : ""}`,
    ...(summary.sandbox !== null
      ? [
          `    Sandbox: ${summary.sandbox.sandbox}`,
          `    Allowed hosts: ${summary.sandbox.allowedHosts}`,
          `    Permissions: ${summary.sandbox.permissions}`,
        ]
      : []),
  ];
  const installationSummary = `\n  Installation Summary:\n${lines.join("\n")}`;
  logger.info(installationSummary);

  // Get confirmation from user if required
  if (!params.force && !params.watch) {
    const answers = await confirm({
      message: `Do you want to continue?`,
      default: false,
    });
    if (!answers) {
      logger.info("Plugin installation is cancelled by the user.");
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
    const watcher = chokidar.watch(pluginFilePath, buildWatchOptions());
    watcher.on("change", async () => {
      await upload({ ...params, force: true, watch: false });
    });
  }

  logger.info("Plugin is installed successfully.");
};

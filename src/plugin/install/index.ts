import fs from "fs/promises";
import { confirm } from "@inquirer/prompts";
import { PluginZip } from "../core";
import {
  buildRestAPIClient,
  type RestAPIClientOptions,
} from "../../kintone/client";
import { logger } from "../../utils/log";
import { CliKintoneError } from "../../utils/error";

export type Params = {
  pluginFilePath: string;
  force: boolean;
  watch: boolean;
};

export const install = async (
  params: Params & RestAPIClientOptions,
): Promise<void> => {
  const { pluginFilePath, ...restApiClientOptions } = params;

  const buffer = await fs.readFile(pluginFilePath);
  const pluginZip = await PluginZip.fromBuffer(buffer);
  const pluginId = await pluginZip.getPluginID();
  const pluginManifest = await pluginZip.manifest();

  const apiClient = buildRestAPIClient(restApiClientOptions);

  const { plugins: installedPlugins } = await apiClient.plugin.getPlugins({
    ids: [pluginId],
  } as any);
  const installedPlugin = installedPlugins.find((p) => p.id === pluginId);
  const isInstalled = installedPlugin !== undefined;

  if (!params.force) {
    const installationSummary = `
    Destination: ${restApiClientOptions.baseUrl}
    File Path: ${pluginFilePath}
    Plugin ID: ${pluginId}
    Plugin Name: ${pluginManifest.name}
    Current version: ${installedPlugin?.version ?? "(not installed)"}
    Target version: ${pluginManifest.version}`;

    logger.info(installationSummary);

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

  logger.info("Plugin installed successfully.");
};

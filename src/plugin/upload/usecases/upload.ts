import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { buildPluginSummary } from "../../core/summary";
import { logger } from "../../../utils/log";
import type { LocalPlugin, LocalPluginRepository } from "./interface";

export type Confirm = (message: string) => Promise<boolean>;

export type UploadOptions = {
  baseUrl: string;
  yes: boolean;
  watch: boolean;
};

const buildInstallationSummary = (
  baseUrl: string,
  plugin: LocalPlugin,
  installedVersion: string | undefined,
): string => {
  const summary = buildPluginSummary(plugin.id, plugin.manifest);
  const reinstall =
    installedVersion === plugin.manifest.version ? " (reinstall)" : "";
  const lines = [
    `Destination: ${baseUrl}`,
    `File Path: ${plugin.filePath}`,
    `Plugin ID: ${summary.id}`,
    `Plugin Name: ${summary.name}`,
    `Current version: ${installedVersion ?? "(not installed)"}`,
    `Target version: ${summary.version}${reinstall}`,
  ];
  if (summary.sandbox !== null) {
    const { sandbox, allowedHosts, permissions } = summary.sandbox;
    lines.push(
      `Sandbox: ${sandbox}`,
      `Allowed hosts: ${allowedHosts}`,
      `Permissions: ${permissions}`,
    );
  }
  return `\n  Installation Summary:\n${lines.map((line) => `    ${line}`).join("\n")}`;
};

export const upload: (
  apiClient: KintoneRestAPIClient,
  pluginSource: LocalPluginRepository,
  options: UploadOptions,
  confirm: Confirm,
) => Promise<void> = async (apiClient, pluginSource, options, confirm) => {
  const plugin = await pluginSource.read();

  const { plugins: installedPlugins } = await apiClient.plugin.getPlugins({
    ids: [plugin.id],
  });
  const installedPlugin = installedPlugins.find((p) => p.id === plugin.id);

  logger.info(
    buildInstallationSummary(options.baseUrl, plugin, installedPlugin?.version),
  );

  if (!options.yes && !options.watch) {
    const confirmed = await confirm("Do you want to continue?");
    if (!confirmed) {
      logger.info("Plugin installation is cancelled by the user.");
      return;
    }
  }

  const { fileKey } = await apiClient.file.uploadFile({
    file: { name: plugin.filePath, data: plugin.buffer },
  });

  if (installedPlugin !== undefined) {
    await apiClient.plugin.updatePlugin({ id: plugin.id, fileKey });
  } else {
    await apiClient.plugin.installPlugin({ fileKey });
  }

  logger.info("Plugin is installed successfully.");
};

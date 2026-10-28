import type {
  ManifestInterface,
  ManifestPermissions,
} from "../../core/manifest/interface";
import { buildPluginSummary } from "../../core/summary";
import type { LocalPluginRepository } from "./interface";

export type OutputFormat = "plain" | "json";

export type PluginInfoJson = {
  id: string;
  name: string;
  version: number | string;
  description: string | undefined;
  homepage: string | undefined;
  sandbox: boolean | undefined;
  allowed_hosts: string[] | undefined;
  permissions: ManifestPermissions | undefined;
};

export const buildPluginInfoJson = (
  id: string,
  manifest: ManifestInterface,
): PluginInfoJson => ({
  id,
  name: manifest.name,
  version: manifest.version,
  description: manifest.description,
  homepage: manifest.homepageUrl,
  sandbox: manifest.sandbox,
  allowed_hosts: manifest.allowedHosts,
  permissions: manifest.permissions,
});

const buildPlainInfo = (id: string, manifest: ManifestInterface): string => {
  const summary = buildPluginSummary(id, manifest);
  const lines = [
    `id: ${summary.id}`,
    `name: ${summary.name}`,
    `version: ${summary.version}`,
    `description: ${summary.description}`,
    `homepage: ${summary.homepage}`,
  ];
  if (summary.sandbox !== null) {
    const { sandbox, allowedHosts, permissions } = summary.sandbox;
    lines.push(
      `sandbox: ${sandbox}`,
      `allowed_hosts: ${allowedHosts}`,
      `permissions: ${permissions}`,
    );
  }
  return lines.join("\n");
};

export const info: (
  pluginSource: LocalPluginRepository,
  format: OutputFormat,
) => Promise<string> = async (pluginSource, format) => {
  const { id, manifest } = await pluginSource.read();
  switch (format) {
    case "plain":
      return buildPlainInfo(id, manifest);
    case "json":
      return JSON.stringify(buildPluginInfoJson(id, manifest), null, 2);
    default: {
      const unexpectedFormat: never = format;
      throw new Error(`Unexpected output format: ${String(unexpectedFormat)}`);
    }
  }
};

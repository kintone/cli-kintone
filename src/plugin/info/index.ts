import fs from "fs/promises";
import { PluginZip } from "../core";
import type {
  ManifestInterface,
  ManifestPermissions,
} from "../core/manifest/interface";
import { buildPluginSummary } from "../core/summary";

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

export const buildJsonInfo = (
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

export const run = async (pluginFilePath: string, format: OutputFormat) => {
  const buffer = await fs.readFile(pluginFilePath);
  const pluginZip = await PluginZip.fromBuffer(buffer);
  const id = await pluginZip.getPluginID();
  const manifest = await pluginZip.manifest();

  switch (format) {
    case "plain": {
      const summary = buildPluginSummary(id, manifest);
      console.log("id:", summary.id);
      console.log("name:", summary.name);
      console.log("version:", summary.version);
      console.log("description:", summary.description);
      console.log("homepage:", summary.homepage);
      if (summary.sandbox !== null) {
        const s = summary.sandbox;
        console.log("sandbox:", s.sandbox);
        console.log("allowed_hosts:", s.allowedHosts);
        console.log("permissions.js_api:", s.permissionsJsApi);
        console.log("permissions.rest_api:", s.permissionsRestApi);
      }
      break;
    }
    case "json": {
      console.log(JSON.stringify(buildJsonInfo(id, manifest), null, 2));
      break;
    }
  }
};

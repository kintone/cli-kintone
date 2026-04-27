import fs from "fs/promises";
import { PluginZip } from "../core";
import { buildPluginSummary } from "../core/summary";

export type OutputFormat = "plain" | "json";

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
        console.log("sandbox:", summary.sandbox.sandbox);
        console.log("allowed_hosts:", summary.sandbox.allowedHosts);
        console.log("permissions.js_api:", summary.sandbox.permissionsJsApi);
        console.log(
          "permissions.rest_api:",
          summary.sandbox.permissionsRestApi,
        );
      }
      break;
    }
    case "json": {
      const info = {
        id,
        name: manifest.name,
        version: manifest.version,
        description: manifest.description,
        homepage: manifest.homepageUrl,
        sandbox: manifest.sandbox,
        allowed_hosts: manifest.allowedHosts,
        permissions: manifest.permissions,
      };
      console.log(JSON.stringify(info, null, 2));
      break;
    }
  }
};

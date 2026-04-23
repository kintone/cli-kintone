import fs from "fs/promises";
import { PluginZip } from "../core";

export type OutputFormat = "plain" | "json";

export const run = async (pluginFilePath: string, format: OutputFormat) => {
  const buffer = await fs.readFile(pluginFilePath);
  const pluginZip = await PluginZip.fromBuffer(buffer);
  const id = await pluginZip.getPluginID();
  const manifest = await pluginZip.manifest();

  const info = {
    id: id,
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    homepage: manifest.homepageUrl,
    sandbox: manifest.sandbox,
    allowed_hosts: manifest.allowedHosts,
    permissions: manifest.permissions,
  };

  // When any of sandbox / allowed_hosts / permissions is defined in the
  // manifest, print all four sandbox-related lines together. For sandbox-
  // unaware plugins (none defined), omit the whole block to avoid noise.
  const hasSandboxFields =
    info.sandbox !== undefined ||
    info.allowed_hosts !== undefined ||
    info.permissions !== undefined;

  const formatList = (list: string[] | undefined) => {
    if (list === undefined) {
      return "(not set)";
    }
    if (list.length === 0) {
      return "(none)";
    }
    return list.join(", ");
  };

  // `permissions.js_api` and `permissions.rest_api` share one parent, so treat
  // "parent defined but child absent" as "(none)" rather than "(not set)".
  const formatPermissionList = (
    list: string[] | undefined,
    parentDefined: boolean,
  ) => {
    if (!parentDefined) {
      return "(not set)";
    }
    if (list === undefined || list.length === 0) {
      return "(none)";
    }
    return list.join(", ");
  };

  switch (format) {
    case "plain":
      console.log("id:", info.id);
      console.log("name:", info.name);
      console.log("version:", info.version);
      console.log("description:", info.description ?? "(not set)");
      console.log("homepage:", info.homepage ?? "(not set)");
      if (hasSandboxFields) {
        const permissionsDefined = info.permissions !== undefined;
        console.log("sandbox:", info.sandbox ?? "(not set)");
        console.log("allowed_hosts:", formatList(info.allowed_hosts));
        console.log(
          "permissions.js_api:",
          formatPermissionList(info.permissions?.js_api, permissionsDefined),
        );
        console.log(
          "permissions.rest_api:",
          formatPermissionList(info.permissions?.rest_api, permissionsDefined),
        );
      }
      break;
    case "json":
      console.log(JSON.stringify(info, null, 2));
  }
};

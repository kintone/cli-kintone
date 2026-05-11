import type { ManifestInterface } from "./manifest/interface";

export type SandboxSummary = {
  sandbox: string;
  allowedHosts: string;
  permissionsJsApi: string;
  permissionsRestApi: string;
};

export type PluginSummary = {
  id: string;
  name: string;
  version: string;
  description: string;
  homepage: string;
  sandbox: SandboxSummary | null;
};

const NOT_SET = "(not set)";
const NONE = "(none)";

// `(not set)` for absent fields (including children whose parent declares them
// optionally and they are omitted); `(none)` only for an explicitly declared
// empty array. This mirrors the schema in @kintone/plugin-manifest-validator,
// where `permissions.js_api` / `permissions.rest_api` are optional arrays.
const formatList = (list: string[] | undefined): string => {
  if (list === undefined) {
    return NOT_SET;
  }
  if (list.length === 0) {
    return NONE;
  }
  return list.join(", ");
};

const buildSandboxSummary = (
  manifest: Pick<ManifestInterface, "sandbox" | "allowedHosts" | "permissions">,
): SandboxSummary | null => {
  const hasFields =
    manifest.sandbox !== undefined ||
    manifest.allowedHosts !== undefined ||
    manifest.permissions !== undefined;
  if (!hasFields) {
    return null;
  }

  return {
    sandbox:
      manifest.sandbox === undefined ? NOT_SET : String(manifest.sandbox),
    allowedHosts: formatList(manifest.allowedHosts),
    permissionsJsApi: formatList(manifest.permissions?.js_api),
    permissionsRestApi: formatList(manifest.permissions?.rest_api),
  };
};

export const buildPluginSummary = (
  id: string,
  manifest: ManifestInterface,
): PluginSummary => {
  return {
    id,
    name: manifest.name,
    version: String(manifest.version),
    description: manifest.description ?? NOT_SET,
    homepage: manifest.homepageUrl ?? NOT_SET,
    sandbox: buildSandboxSummary(manifest),
  };
};

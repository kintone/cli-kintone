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

const formatHostList = (list: string[] | undefined): string => {
  if (list === undefined) {
    return NOT_SET;
  }
  if (list.length === 0) {
    return NONE;
  }
  return list.join(", ");
};

// permissions.js_api / .rest_api は親 (permissions) の有無で挙動が変わる:
//   permissions 自体が未宣言        → (not set)
//   permissions.{js_api|rest_api}   → 空配列でも未指定でも (none)
// allowed_hosts のように「自身の undefined と [] を区別する」構造ではない点に注意。
const formatPermissionList = (
  list: string[] | undefined,
  parentDefined: boolean,
): string => {
  if (!parentDefined) {
    return NOT_SET;
  }
  if (list === undefined || list.length === 0) {
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

  const permissionsDefined = manifest.permissions !== undefined;
  return {
    sandbox:
      manifest.sandbox === undefined ? NOT_SET : String(manifest.sandbox),
    allowedHosts: formatHostList(manifest.allowedHosts),
    permissionsJsApi: formatPermissionList(
      manifest.permissions?.js_api,
      permissionsDefined,
    ),
    permissionsRestApi: formatPermissionList(
      manifest.permissions?.rest_api,
      permissionsDefined,
    ),
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

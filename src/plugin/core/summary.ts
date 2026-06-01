import type {
  ManifestInterface,
  ManifestPermissions,
} from "./manifest/interface";

export type SandboxSummary = {
  sandbox: string;
  allowedHosts: string;
  permissions: string;
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
// where `allowed_hosts` / `permissions` are optional arrays.
const formatList = (list: string[] | undefined): string => {
  if (list === undefined) {
    return NOT_SET;
  }
  if (list.length === 0) {
    return NONE;
  }
  return list.join(", ");
};

// Each permission renders as `permission[:scope]`; the list is comma-joined.
const formatPermissions = (
  permissions: ManifestPermissions | undefined,
): string =>
  formatList(
    permissions?.map(({ permission, scope }) =>
      scope === undefined ? permission : `${permission}:${scope}`,
    ),
  );

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
    permissions: formatPermissions(manifest.permissions),
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

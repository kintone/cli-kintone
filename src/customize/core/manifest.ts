import type { CustomizeManifest } from "./types";

// One entry per property of CustomizeManifest. A property added to the interface
// has to be added here too, otherwise this record does not compile.
const knownProperties: Record<keyof CustomizeManifest, true> = {
  app: true,
  scope: true,
  desktop: true,
  mobile: true,
  permissions: true,
  allowed_hosts: true,
};

/**
 * Lists the properties that cli-kintone does not recognize.
 *
 * An unrecognized property is ignored, and a misspelled `permissions` or
 * `allowed_hosts` is indistinguishable from leaving the property out, which
 * keeps the setting on the app as it is.
 */
export const findUnknownProperties = (manifest: CustomizeManifest): string[] =>
  Object.keys(manifest).filter((property) => !(property in knownProperties));

/**
 * Lists what is wrong with the sandbox properties of the manifest.
 *
 * The API rejects a wrong shape as well, but only after `customize apply` has
 * uploaded the files, and its message describes the request instead of the manifest.
 */
export const findSandboxPropertyProblems = (
  manifest: CustomizeManifest,
): string[] => {
  const problems: string[] = [];

  if (manifest.permissions !== undefined) {
    if (!Array.isArray(manifest.permissions)) {
      problems.push("permissions must be an array");
    } else {
      manifest.permissions.forEach((entry, index) => {
        if (
          typeof entry !== "object" ||
          entry === null ||
          typeof entry.permission !== "string"
        ) {
          problems.push(
            `permissions[${index}] must be an object with a permission property of type string`,
          );
          return;
        }
        if (entry.scope !== undefined && typeof entry.scope !== "string") {
          problems.push(`permissions[${index}].scope must be a string`);
        }
      });
    }
  }

  if (manifest.allowed_hosts !== undefined) {
    if (!Array.isArray(manifest.allowed_hosts)) {
      problems.push("allowed_hosts must be an array");
    } else {
      manifest.allowed_hosts.forEach((entry, index) => {
        if (typeof entry !== "string") {
          problems.push(`allowed_hosts[${index}] must be a string`);
        }
      });
    }
  }

  return problems;
};

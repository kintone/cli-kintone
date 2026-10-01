import type { BoundMessage } from "./messages";
import type { CustomizeManifest } from "./types";

export type ValidationResult =
  | {
      valid: true;
      warnings: string[];
    }
  | {
      valid: false;
      warnings: string[];
      errors: string[];
    };

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
 * Validates the manifest before `customize apply` uploads any file.
 *
 * An unrecognized property is a warning, not an error: it is ignored, but a
 * misspelled `permissions` or `allowed_hosts` is indistinguishable from leaving
 * the property out, which keeps the setting on the app as it is.
 *
 * A wrong shape of the sandbox properties is an error. The API rejects it as
 * well, but only after the files are uploaded, and its message describes the
 * request instead of the manifest.
 */
export const validateCustomizeManifest = (
  manifest: CustomizeManifest,
  m: BoundMessage,
): ValidationResult => {
  const warnings: string[] = [];
  const unknownProperties = Object.keys(manifest).filter(
    (property) => !(property in knownProperties),
  );
  if (unknownProperties.length > 0) {
    warnings.push(`${m("W_UnknownProperty")} ${unknownProperties.join(", ")}`);
  }

  const errors = validateSandboxProperties(manifest);
  if (errors.length > 0) {
    return { valid: false, warnings, errors };
  }
  return { valid: true, warnings };
};

const validateSandboxProperties = (manifest: CustomizeManifest): string[] => {
  const errors: string[] = [];

  if (manifest.permissions !== undefined) {
    if (!Array.isArray(manifest.permissions)) {
      errors.push("permissions must be an array");
    } else {
      manifest.permissions.forEach((entry, index) => {
        if (
          typeof entry !== "object" ||
          entry === null ||
          typeof entry.permission !== "string"
        ) {
          errors.push(
            `permissions[${index}] must be an object with a permission property of type string`,
          );
          return;
        }
        if (entry.scope !== undefined && typeof entry.scope !== "string") {
          errors.push(`permissions[${index}].scope must be a string`);
        }
      });
    }
  }

  if (manifest.allowed_hosts !== undefined) {
    if (!Array.isArray(manifest.allowed_hosts)) {
      errors.push("allowed_hosts must be an array");
    } else {
      manifest.allowed_hosts.forEach((entry, index) => {
        if (typeof entry !== "string") {
          errors.push(`allowed_hosts[${index}] must be a string`);
        }
      });
    }
  }

  return errors;
};

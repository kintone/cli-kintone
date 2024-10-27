import type * as Ajv from "ajv";
import type { DriverInterface } from "../driver";
import type { ManifestInterface } from "./interface";
import validate from "@kintone/plugin-manifest-validator";

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

export const validateManifest = async (
  manifest: ManifestInterface,
  driver?: DriverInterface,
): Promise<ValidationResult> => {
  const options = driver
    ? {
        relativePath: validateRelativePath(driver),
        maxFileSize: validateMaxFileSize(driver),
        fileExists: validateFileExists(driver),
      }
    : {};

  const result = validate(manifest.json, options);

  const warnings = result.warnings?.map((warn) => warn.message) ?? [];

  if (result.valid) {
    return {
      valid: true as const,
      warnings,
    };
  }

  const errors = generateErrorMessages(result.errors ?? []);
  return {
    valid: false as const,
    warnings,
    errors,
  };
};

const generateErrorMessages = (errors: Ajv.ErrorObject[]): string[] => {
  return errors.map((e) => {
    if (e.keyword === "enum") {
      return `"${e.instancePath}" ${e.message} (${(
        e.params.allowedValues as any[]
      )
        .map((v) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.instancePath}" ${e.message}`;
  });
};

// TODO: This types must be exported from kintone/plugin-manifest-validator
type ValidatorResult =
  | boolean
  | {
      valid: true;
    }
  | {
      valid: false;
      message?: string;
    };

// TODO: Make below functions async after https://github.com/kintone/js-sdk/pull/3037 merged

const validateRelativePath =
  (driver: DriverInterface) =>
  (filePath: string): boolean => {
    try {
      const stat = driver.statSync(filePath);
      return stat.isFile;
    } catch (_) {
      return false;
    }
  };

/**
 * Return validator for `maxFileSize` keyword
 */
const validateMaxFileSize =
  (driver: DriverInterface) =>
  (maxBytes: number, filePath: string): ValidatorResult => {
    try {
      const stat = driver.statSync(filePath);
      return stat.size <= maxBytes;
    } catch (e) {
      return { valid: false, message: e ? `${e}` : undefined };
    }
  };

const validateFileExists =
  (driver: DriverInterface) =>
  (filePath: string): ValidatorResult => {
    try {
      const stat = driver.statSync(filePath);
      return stat.isFile;
    } catch (e) {
      return { valid: false, message: e ? `${e}` : undefined };
    }
  };

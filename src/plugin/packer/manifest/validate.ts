import type * as Ajv from "ajv";
import type { DriverInterface } from "../driver";
import type { ValidatorResult } from "./interface";

export const generateErrorMessages = (errors: Ajv.ErrorObject[]): string[] => {
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

// TODO: Make below functions async after https://github.com/kintone/js-sdk/pull/3037 merged

export const validateRelativePath =
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
export const validateMaxFileSize =
  (driver: DriverInterface) =>
  (maxBytes: number, filePath: string): ValidatorResult => {
    try {
      const stat = driver.statSync(filePath);
      return stat.size <= maxBytes;
    } catch (e) {
      return { valid: false, message: e ? `${e}` : undefined };
    }
  };

export const validateFileExists =
  (driver: DriverInterface) =>
  (filePath: string): ValidatorResult => {
    try {
      const stat = driver.statSync(filePath);
      return stat.isFile;
    } catch (e) {
      return { valid: false, message: e ? `${e}` : undefined };
    }
  };

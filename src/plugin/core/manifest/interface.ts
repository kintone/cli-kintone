import type { DriverInterface } from "../driver";
import type { ContentsZip } from "../contents";

export interface ManifestStaticInterface {
  parseJson(manifestJson: string): ManifestInterface;
  loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestInterface>;
}

export interface ManifestInterface {
  validate(options?: ValidatorOptions): ValidationResult;
  sourceList(): string[];
  generateContentsZip(driver: DriverInterface): Promise<ContentsZip>;

  // Accessor
  get manifestVersion(): 1 | 2;
  get name(): string;
  get version(): number | string;
  get description(): string | undefined;
  get homepageUrl(): string | undefined;
}

// TODO: These types must be exported from kintone/plugin-manifest-validator
export type ValidatorOptions = {
  relativePath?: (filePath: string) => boolean;
  maxFileSize?: (maxBytes: number, filePath: string) => ValidatorResult;
  fileExists?: (filePath: string) => ValidatorResult;
};
export type ValidatorResult =
  | boolean
  | {
      valid: true;
    }
  | {
      valid: false;
      message?: string;
    };

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

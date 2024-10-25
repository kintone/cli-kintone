import { sourceList } from "./sourcelist";
import validate from "@kintone/plugin-manifest-validator";
import _debug from "debug";
import fs from "fs";

const debug = _debug("manifest");

export interface ManifestStaticInterface {
  parseJson(manifestJson: string): ManifestInterface;
  loadJsonFile(jsonFilePath: string): Promise<ManifestInterface>;
}

export interface ManifestInterface {
  validate(options?: ValidatorOptions): ReturnType<typeof validate>;
  sourceList(): string[];
}

export class ManifestV1 implements ManifestInterface {
  manifest: unknown;

  constructor(manifest: unknown) {
    this.manifest = manifest;
  }

  static parseJson(manifestJson: string): ManifestV1 {
    return new ManifestV1(JSON.parse(manifestJson));
  }

  /**
   * Load JSON file without caching
   */
  public static async loadJsonFile(jsonFilePath: string): Promise<ManifestV1> {
    const manifestJson = fs.readFileSync(jsonFilePath, "utf-8");
    return ManifestV1.parseJson(manifestJson);
  }

  validate(options?: ValidatorOptions) {
    const result = validate(this.manifest as any, options);
    debug(result);
    return result;
  }

  sourceList(): string[] {
    return sourceList(this.manifest);
  }
}

const _ = ManifestV1 satisfies ManifestStaticInterface;

// TODO: These types must be exported from kintone/plugin-manifest-validator
type ValidatorOptions = {
  relativePath?: (filePath: string) => boolean;
  maxFileSize?: (maxBytes: number, filePath: string) => ValidatorResult;
  fileExists?: (filePath: string) => ValidatorResult;
};
type ValidatorResult =
  | boolean
  | {
      valid: true;
    }
  | {
      valid: false;
      message?: string;
    };

import fs from "fs";
import _debug from "debug";
import validate from "@kintone/plugin-manifest-validator";
import type {
  ManifestInterface,
  ManifestStaticInterface,
  ValidatorOptions,
} from "../interface";
import { sourceListV2 } from "./sourcelist";

const debug = _debug("manifest");

export class ManifestV2 implements ManifestInterface {
  manifest: ManifestV2JsonObject;

  constructor(manifest: ManifestV2JsonObject) {
    this.manifest = manifest;
  }

  static parseJson(manifestJson: string): ManifestV2 {
    return new ManifestV2(JSON.parse(manifestJson));
  }

  /**
   * Load JSON file without caching
   */
  public static async loadJsonFile(jsonFilePath: string): Promise<ManifestV2> {
    const manifestJson = fs.readFileSync(jsonFilePath, "utf-8");
    return ManifestV2.parseJson(manifestJson);
  }

  get manifestVersion(): 2 {
    return 2;
  }

  validate(options?: ValidatorOptions) {
    const result = validate(this.manifest as any, options);
    debug(result);
    return result;
  }

  sourceList(): string[] {
    return sourceListV2(this.manifest);
  }
}

const _ = ManifestV2 satisfies ManifestStaticInterface;

export type ManifestV2JsonObject = {
  $schema?: string;
  manifest_version: 2;
  version: number;
  type?: "APP";
  name: {
    ja?: string;
    en: string;
    zh?: string;
  };
  description: {
    ja?: string;
    en: string;
    zh?: string;
  };
  icon: string;
  homepage_url: {
    ja: string;
    en: string;
    zh: string;
  };
  components?: [
    {
      type: "APP_INDEX_HEADER_SPACE" | "APP_INDEX_HEADLESS";
      js?: string[];
      css?: string[];
      html?: string;
    },
  ];
  config?: {
    html?: string;
    js?: string[];
    css?: string[];
    required_params?: string[];
  };
  allowed_hosts?: string[];
  permissions?: {
    js_api?: string[];
    rest_api?: string[];
  };
};

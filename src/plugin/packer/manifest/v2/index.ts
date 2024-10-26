import type {
  ManifestInterface,
  ManifestStaticInterface,
  ValidatorOptions,
} from "../interface";
import { sourceListV2 } from "./sourcelist";
import type { DriverInterface } from "../../driver";
import { LocalFSDriver } from "../../driver";
import { ContentsZip } from "../../plugin-zip/contents-zip";

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
  public static async loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestV2> {
    const _driver = driver ?? new LocalFSDriver();
    const manifestJson = await _driver.readFile(jsonFilePath, "utf-8");
    return this.parseJson(manifestJson);
  }

  get manifestVersion(): 2 {
    return 2;
  }

  get name(): string {
    return this.manifest.name.en;
  }

  get version(): number | string {
    return this.manifest.version;
  }

  get description(): string | undefined {
    return this.manifest.description?.en;
  }

  get homepageUrl(): string | undefined {
    return this.manifest.homepage_url?.en;
  }

  validate(_options?: ValidatorOptions) {
    // TODO: Implement Validation
    return {
      valid: true as const,
      warnings: [],
    };
  }

  sourceList(): string[] {
    return sourceListV2(this.manifest);
  }

  async generateContentsZip(driver: DriverInterface): Promise<ContentsZip> {
    return ContentsZip.createFromManifest(this, driver);
  }
}

const _ = ManifestV2 satisfies ManifestStaticInterface;

export type ManifestV2JsonObject = {
  $schema?: string;
  manifest_version: 2;
  version: number | string;
  type?: "APP";
  name: {
    ja?: string;
    en: string;
    zh?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
  };
  icon: string;
  homepage_url?: {
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

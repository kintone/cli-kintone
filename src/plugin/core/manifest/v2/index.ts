import path from "path";
import type {
  ManifestInterface,
  ManifestPermissions,
  ManifestStaticInterface,
} from "../interface";
import { sourceListV2 } from "./sourcelist";
import type { DriverInterface } from "../../driver";
import { LocalFSDriver } from "../../driver";
import { ContentsZip } from "../../contents";

export class ManifestV2 implements ManifestInterface {
  manifest: ManifestV2JsonObject;
  manifestFileName = "manifest.json";

  constructor(manifest: ManifestV2JsonObject) {
    this.manifest = manifest;
  }

  static parseJson(manifestJson: string): ManifestV2 {
    return new ManifestV2(JSON.parse(manifestJson));
  }

  public static async loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestV2> {
    const _driver = driver ?? new LocalFSDriver();
    const manifestJson = await _driver.readFile(jsonFilePath, "utf-8");
    const manifest = this.parseJson(manifestJson);
    manifest.manifestFileName = path.basename(jsonFilePath);
    return manifest;
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

  // Manifest v2 does not define a sandbox field; always absent by design.
  get sandbox(): undefined {
    return undefined;
  }

  get allowedHosts(): string[] | undefined {
    return this.manifest.allowed_hosts;
  }

  get permissions(): ManifestPermissions | undefined {
    return this.manifest.permissions;
  }

  get json(): ManifestV2JsonObject {
    return this.manifest;
  }

  async validate(_driver?: DriverInterface) {
    // TODO: Implement Validation
    return {
      valid: true as const,
      warnings: [],
    };
  }

  sourceList(): string[] {
    return sourceListV2(this.manifest, this.manifestFileName);
  }

  async generateContentsZip(driver: DriverInterface): Promise<ContentsZip> {
    return ContentsZip.buildFromManifest(this, driver);
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
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
    ms?: string;
  };
  description?: {
    ja?: string;
    en: string;
    zh?: string;
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
    ms?: string;
  };
  icon: string;
  homepage_url?: {
    ja: string;
    en: string;
    zh: string;
    "zh-TW"?: string;
    es?: string;
    "pt-BR"?: string;
    th?: string;
    ms?: string;
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
  permissions?: ManifestPermissions;
};

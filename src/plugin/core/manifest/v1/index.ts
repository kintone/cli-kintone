import _debug from "debug";
import { sourceList } from "./sourcelist";
import type { ManifestInterface, ManifestStaticInterface } from "../interface";
import type { DriverInterface } from "../../driver";
import { LocalFSDriver } from "../../driver";
import { validateManifest } from "../validate";
import { ContentsZip } from "../../contents";

const debug = _debug("manifest");

export class ManifestV1 implements ManifestInterface {
  manifest: ManifestV1JsonObject;

  constructor(manifest: ManifestV1JsonObject) {
    this.manifest = manifest;
  }

  static parseJson(manifestJson: string): ManifestV1 {
    return new ManifestV1(JSON.parse(manifestJson));
  }

  /**
   * Load JSON file without caching
   */
  public static async loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestV1> {
    const _driver = driver ?? new LocalFSDriver();
    const manifestJson = await _driver.readFile(jsonFilePath, "utf-8");
    return this.parseJson(manifestJson);
  }

  get manifestVersion(): 1 {
    return 1;
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

  get json(): ManifestV1JsonObject {
    return this.manifest;
  }

  async validate(driver?: DriverInterface) {
    const result = await validateManifest(this, driver);
    debug(result);
    return result;
  }

  sourceList(): string[] {
    return sourceList(this.manifest);
  }

  async generateContentsZip(driver: DriverInterface): Promise<ContentsZip> {
    return ContentsZip.createFromManifest(this, driver);
  }
}

const _ = ManifestV1 satisfies ManifestStaticInterface;

export type ManifestV1JsonObject = {
  $schema?: string;
  manifest_version: 1;
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
  desktop?: {
    js?: string[];
    css?: string[];
  };
  mobile?: {
    js?: string[];
    css?: string[];
  };
  config?: {
    html?: string;
    js?: string[];
    css?: string[];
    required_params?: string[];
  };
};

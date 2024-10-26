import _debug from "debug";
import validate from "@kintone/plugin-manifest-validator";
import { sourceList } from "./sourcelist";
import type {
  ManifestInterface,
  ManifestStaticInterface,
  ValidatorOptions,
} from "../interface";
import type { DriverInterface } from "../../driver";
import { LocalFSDriver } from "../../driver";

const debug = _debug("manifest");

export class ManifestV1 implements ManifestInterface {
  // TODO: Define manifest v1 type
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
    return (this.manifest as any).name.en;
  }

  get version(): number | string {
    return (this.manifest as any).version;
  }

  get description(): string | undefined {
    return (this.manifest as any).description?.en;
  }

  get homepageUrl(): string | undefined {
    return (this.manifest as any).homepage_url?.en;
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

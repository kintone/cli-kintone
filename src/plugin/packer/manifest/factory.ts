import type { DriverInterface } from "../driver/";
import { LocalFSDriver } from "../driver/";
import type { ManifestInterface, ManifestStaticInterface } from "./interface";
import { ManifestV1 } from "./v1";
import { ManifestV2 } from "./v2";

export class ManifestFactory {
  private constructor() {
    /* noop */
  }

  static parseJson(manifestJson: string): ManifestInterface {
    const json: unknown = JSON.parse(manifestJson);

    // TODO: Replace this validation with Ajv
    if (!(typeof json === "object" && json !== null)) {
      throw new Error("The root of manifest must be object");
    }

    if (!("manifest_version" in json)) {
      throw new Error("manifest_version must be set in manifest.json");
    }

    if (typeof json.manifest_version !== "number") {
      throw new Error("manifest_version must be number");
    }

    switch (json.manifest_version) {
      case 1:
        return new ManifestV1(json);
      case 2:
        return new ManifestV2(json as any);
      default:
        throw new Error("manifest_version must be 1 or 2");
    }
  }

  /**
   * Load JSON file without caching
   */
  public static async loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestInterface> {
    const _driver = driver ?? new LocalFSDriver();
    const manifestJson = await _driver.readFile(jsonFilePath, "utf-8");
    return this.parseJson(manifestJson);
  }
}
const _ = ManifestFactory satisfies ManifestStaticInterface;

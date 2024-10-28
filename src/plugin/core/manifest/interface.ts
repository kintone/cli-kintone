import type { DriverInterface } from "../driver";
import type { ContentsZip } from "../contents";
import type { ValidationResult } from "./validate";

export interface ManifestStaticInterface {
  /**
   * Parse JSON object to Manifest
   * @param manifestJson
   */
  parseJson(manifestJson: string): ManifestInterface;
  /**
   * Load and parse JSON file to Manifest
   */
  loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestInterface>;
}

export interface ManifestInterface {
  /**
   * Validate Manifest
   * @param driver If set, also validate file existence and file size.
   */
  validate(driver?: DriverInterface): Promise<ValidationResult>;

  /**
   * Returns files described in a Manifest
   */
  sourceList(): string[];

  /**
   * Generate contents.zip from Manifest and Driver
   * @param driver
   */
  generateContentsZip(driver: DriverInterface): Promise<ContentsZip>;

  // Accessor
  get manifestVersion(): 1 | 2;
  get name(): string;
  get version(): number | string;
  get description(): string | undefined;
  get homepageUrl(): string | undefined;

  /**
   * Returns JSON object represents Manifest raw object.
   */
  get json(): object;
}

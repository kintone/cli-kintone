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
  // TODO: Validating file existence and file size are better to be done in contents validation.
  /**
   * Validate Manifest
   * @param driver If set, also validate file existence and file size.
   */
  validate(driver?: DriverInterface): Promise<ValidationResult>;

  /**
   * Returns files described in a Manifest
   */
  sourceList(): string[];

  // TODO: Refactor this method as a static factory method of ContentsZip
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

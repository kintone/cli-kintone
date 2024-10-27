import type { DriverInterface } from "../driver";
import type { ContentsZip } from "../contents";
import type { ValidationResult } from "./validate";

export interface ManifestStaticInterface {
  parseJson(manifestJson: string): ManifestInterface;
  loadJsonFile(
    jsonFilePath: string,
    driver?: DriverInterface,
  ): Promise<ManifestInterface>;
}

export interface ManifestInterface {
  validate(driver?: DriverInterface): Promise<ValidationResult>;
  sourceList(): string[];
  generateContentsZip(driver: DriverInterface): Promise<ContentsZip>;

  // Accessor
  get manifestVersion(): 1 | 2;
  get name(): string;
  get version(): number | string;
  get description(): string | undefined;
  get homepageUrl(): string | undefined;

  get json(): object;
}

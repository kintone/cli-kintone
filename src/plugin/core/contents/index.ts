import type { ManifestInterface } from "../manifest";
import { ManifestFactory } from "../manifest";

import type { DriverInterface } from "../driver";
import { ZipFileDriver } from "../driver";
import { createContentsZip } from "./zip";

/**
 * Contents represents the plugin source files aggregated by Manifest
 */
export interface ContentsInterface extends DriverInterface {
  /**
   * returns Manifest
   */
  manifest(): Promise<ManifestInterface>;

  /**
   * validate contents
   */
  validate(): Promise<void>;
}

export class ContentsZip extends ZipFileDriver implements ContentsInterface {
  private constructor(buffer: Buffer) {
    super(buffer);
  }

  public static async createFromManifest(
    manifest: ManifestInterface,
    driver: DriverInterface,
  ): Promise<ContentsZip> {
    const buffer = await createContentsZip(manifest, driver);
    // const buffer = await _createContentsZipStream(manifest, driver);
    return ContentsZip.fromBuffer(buffer);
  }

  public static async fromBuffer(buffer: Buffer) {
    const contentsZip = new ContentsZip(buffer);
    await contentsZip.cacheEntries();
    await contentsZip.validate();
    return contentsZip;
  }

  public async manifest(): Promise<ManifestInterface> {
    const manifestJson = await this.readFile("manifest.json", "utf-8");
    return ManifestFactory.parseJson(manifestJson);
  }

  public async validate() {
    const manifest = await this.manifest();

    // entry.fileName is a relative path separated by posix style(/) so this makes separators always posix style.
    // const getEntryKey = (filePath: string) =>
    //   filePath.replace(new RegExp(`\\${path.sep}`, "g"), "/");

    const result = await manifest.validate(this);

    if (!result.valid) {
      const e: any = new Error(result.errors.join(", "));
      e.validationErrors = result.errors;
      throw e;
    }
  }
}

import type { ManifestInterface } from "../../manifest";
import { ManifestFactory } from "../../manifest";

import { validateContentsZip } from "./validate";
import type { DriverInterface } from "../../driver";
import { ZipFileDriver } from "../../driver";
import { createContentsZip } from "./zip";

export interface ContentsZipInterface extends ZipFileDriver {
  manifest(): Promise<ManifestInterface>;
}

export class ContentsZip extends ZipFileDriver implements ContentsZipInterface {
  private constructor(buffer: Buffer) {
    super(buffer);
  }

  public static async createFromManifest(
    manifest: ManifestInterface,
    driver: DriverInterface,
  ): Promise<ContentsZip> {
    const buffer = await createContentsZip(manifest, driver);
    // const buffer = await _createContentsZipStream(manifest, driver);
    const contentsZip = new ContentsZip(buffer);
    await validateContentsZip(contentsZip);
    return contentsZip;
  }

  public static async fromBuffer(buffer: Buffer) {
    const contentsZip = new ContentsZip(buffer);
    await validateContentsZip(contentsZip);
    return contentsZip;
  }

  public async manifest(): Promise<ManifestInterface> {
    const manifestJson = await this.readFile("manifest.json", "utf-8");
    return ManifestFactory.parseJson(manifestJson);
  }
}

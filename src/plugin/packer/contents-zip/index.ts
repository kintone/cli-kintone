import { readZipContentsNames } from "../__tests__/helpers/zip";
import { createContentsZip } from "./create-contents-zip";
import type { ManifestInterface } from "../manifest";
import { validateContentsZip } from "./zip";

export interface ContentsZipInterface {
  fileList(): Promise<string[]>;
  get buffer(): Buffer;
}

export class ContentsZip implements ContentsZipInterface {
  private readonly zip: Buffer;

  private constructor(zipFile: Buffer) {
    this.zip = zipFile;
  }

  public static async createFromManifest(
    pluginDir: string,
    manifest: ManifestInterface,
  ): Promise<ContentsZip> {
    const buffer = await createContentsZip(pluginDir, manifest);
    await validateContentsZip(buffer);
    return new ContentsZip(buffer);
  }

  public static async fromBuffer(buffer: Buffer) {
    await validateContentsZip(buffer);
    return new ContentsZip(buffer);
  }

  async fileList(): Promise<string[]> {
    return readZipContentsNames(this.zip);
  }

  public get buffer() {
    return this.zip;
  }
}

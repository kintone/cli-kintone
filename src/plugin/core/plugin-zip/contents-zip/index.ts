import type { ManifestInterface } from "../../manifest";
import { ManifestFactory } from "../../manifest";
import streamBuffers from "stream-buffers";
import yazl from "yazl";

import _debug from "debug";
import { finished } from "node:stream/promises";
import { validateContentsZip } from "./validate";
import type { DriverInterface } from "../../driver";
import { ZipFileDriver } from "../../driver";
import path from "path";

const debug = _debug("contents-zip");

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

/**
 * Create a zipped contents
 */
const createContentsZip = async (
  manifest: ManifestInterface,
  driver: DriverInterface,
): Promise<Buffer> => {
  let size = NaN;
  const zipFile = new yazl.ZipFile();
  const output = new streamBuffers.WritableStreamBuffer();

  zipFile.outputStream.pipe(output);

  for (const src of manifest.sourceList()) {
    const data = await driver.readFile(src);
    zipFile.addBuffer(data, src);
  }
  zipFile.end(undefined, ((finalSize: number) => {
    size = finalSize;
  }) as any);
  await finished(output);

  debug(`plugin.zip: ${size} bytes`);
  return output.getContents() as Buffer;
};

/**
 * Create a zipped contents using stream. Can be faster than createContentsZip above.
 */
const _createContentsZipStream = async (
  manifest: ManifestInterface,
  driver: DriverInterface,
): Promise<Buffer> => {
  // TODO: Support prefix
  //  The zip file not created plugin-packer can have additional parent directories
  const manifestPath = "";
  const manifestPrefix = path.dirname(manifestPath);

  let size = NaN;
  const zipFile = new yazl.ZipFile();
  const output = new streamBuffers.WritableStreamBuffer();
  zipFile.outputStream.pipe(output);

  const promises = manifest.sourceList().map(async (src) => {
    const entryName = path.join(manifestPrefix, src);
    const entry = await driver.stat(entryName);
    if (entry === undefined) {
      throw new Error(`Failed to find entry: ${entryName}`);
    }
    const readable = await driver.openReadStream(entryName);

    zipFile.addReadStream(readable, src, {
      size: entry.size,
    });
  });
  await Promise.all(promises);
  zipFile.end(undefined, ((finalSize: number) => {
    size = finalSize;
  }) as any);
  await finished(output);

  debug(`plugin.zip: ${size} bytes`);
  return output.getContents() as Buffer;
};

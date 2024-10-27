import type { ManifestInterface } from "../manifest";
import type { DriverInterface } from "../driver";
import yazl from "yazl";
import path from "path";
import consumers from "node:stream/consumers";
import { logger } from "../../../utils/log";

/**
 * Create a zipped contents
 */
export const createContentsZip = async (
  manifest: ManifestInterface,
  driver: DriverInterface,
): Promise<Buffer> => {
  let size = NaN;
  const zipFile = new yazl.ZipFile();

  for (const src of manifest.sourceList()) {
    const data = await driver.readFile(src);
    zipFile.addBuffer(data, src);
  }
  zipFile.end(undefined, ((finalSize: number) => {
    size = finalSize;
  }) as any);

  logger.trace(`plugin.zip: ${size} bytes`);
  return consumers.buffer(zipFile.outputStream);
};

/**
 * Create a zipped contents using stream. Can be faster than createContentsZip above.
 */
export const _createContentsZipStream = async (
  manifest: ManifestInterface,
  driver: DriverInterface,
): Promise<Buffer> => {
  // TODO: Support prefix
  //  The zip file not created plugin-packer can have additional parent directories
  const manifestPath = "";
  const manifestPrefix = path.dirname(manifestPath);

  let size = NaN;
  const zipFile = new yazl.ZipFile();

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

  logger.trace(`plugin.zip: ${size} bytes`);
  return consumers.buffer(zipFile.outputStream);
};

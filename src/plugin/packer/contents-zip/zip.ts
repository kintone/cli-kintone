import path from "path";
import * as yazl from "yazl";
import * as streamBuffers from "stream-buffers";

import { finished } from "node:stream/promises";
import type { ContentsZipInterface } from "./index";

// rezip() has been only used in web version plugin packer.
// We are keeping this function to support a web version in the future.

/**
 * Extract and rezip contents.zip
 */
export const rezip = async (
  contentsZip: ContentsZipInterface,
): Promise<Buffer> => {
  const manifest = await contentsZip.manifest();

  // TODO: Support prefix
  //  The zip file not created plugin-packer can have additional parent directories
  const manifestPath = "";
  const manifestPrefix = path.dirname(manifestPath);

  const newZipFile = new yazl.ZipFile();

  const output = new streamBuffers.WritableStreamBuffer();
  newZipFile.outputStream.pipe(output);
  const promises = manifest.sourceList().map(async (src) => {
    const entryName = path.join(manifestPrefix, src);
    const entry = await contentsZip.stat(entryName);
    if (entry === undefined) {
      throw new Error(`Failed to find entry: ${entryName}`);
    }
    const readable = await contentsZip.openReadStream(entryName);

    newZipFile.addReadStream(readable, src, {
      size: entry.size,
    });
  });
  await Promise.all(promises);
  newZipFile.end();

  await finished(output);
  return output.getContents() as Buffer;
};

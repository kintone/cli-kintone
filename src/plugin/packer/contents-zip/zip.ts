import path from "path";
import * as yazl from "yazl";
import type * as yauzl from "yauzl";
import { promisify } from "util";
import * as streamBuffers from "stream-buffers";

import type internal from "stream";
import type { ManifestInterface } from "../manifest";
import { finished } from "node:stream/promises";
import type { ContentsZipInterface } from "./index";
import type { Entries } from "../zip";

// rezip() has been only used in web version plugin packer.
// We are keeping this function to support a web version in the future.

/**
 * Extract and rezip contents.zip
 */
export const rezip = async (
  contentsZip: ContentsZipInterface,
): Promise<Buffer> => {
  const entries = await contentsZip.entries();
  const zipFile = await contentsZip.unzip();
  const manifest = await contentsZip.manifest();
  return rezipContents(zipFile, entries, manifest);
};

const rezipContents = async (
  zipFile: yauzl.ZipFile,
  entries: Entries,
  manifest: ManifestInterface,
): Promise<Buffer> => {
  // TODO: Support prefix
  //  The zip file not created plugin-packer can have additional parent directories
  const manifestPath = "";
  const manifestPrefix = path.dirname(manifestPath);

  const newZipFile = new yazl.ZipFile();

  const output = new streamBuffers.WritableStreamBuffer();
  newZipFile.outputStream.pipe(output);
  const openReadStream = promisify(zipFile.openReadStream.bind(zipFile));
  const promises = manifest.sourceList().map((src) => {
    const entryName = path.join(manifestPrefix, src);
    const entry = entries.get(entryName);
    if (entry === undefined) {
      throw new Error(`Failed to find entry: ${entryName}`);
    }
    return openReadStream(entry).then((stream) => {
      newZipFile.addReadStream(stream as internal.Readable, src, {
        size: entry.uncompressedSize,
      });
    });
  });
  await Promise.all(promises);
  newZipFile.end();

  await finished(output);
  return output.getContents() as Buffer;
};

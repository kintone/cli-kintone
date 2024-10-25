import path from "path";
import { ZipFile } from "yazl";
import streamBuffers from "stream-buffers";
import _debug from "debug";
import type { ManifestInterface } from "../manifest";

const debug = _debug("create-contents-zip");

/**
 * Create a zipped contents
 */
export const createContentsZip = async (
  pluginDir: string,
  manifest: ManifestInterface,
): Promise<Buffer> => {
  return new Promise((res) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new ZipFile();
    let size: any = null;
    output.on("finish", () => {
      debug(`plugin.zip: ${size} bytes`);
      res(output.getContents() as any);
    });
    zipFile.outputStream.pipe(output);
    manifest.sourceList().forEach((src) => {
      zipFile.addFile(path.join(pluginDir, src), src);
    });
    zipFile.end(undefined, ((finalSize: number) => {
      size = finalSize;
    }) as any);
  });
};

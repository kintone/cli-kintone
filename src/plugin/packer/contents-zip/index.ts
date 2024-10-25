import type { ManifestInterface } from "../manifest";
import { validateContentsZip } from "./zip";
import { ZipFile } from "../zip";
import streamBuffers from "stream-buffers";
import path from "path";
import yazl from "yazl";

import _debug from "debug";

const debug = _debug("contents-zip");

export interface ContentsZipInterface {
  fileList(): Promise<string[]>;
  get buffer(): Buffer;
}

export class ContentsZip extends ZipFile implements ContentsZipInterface {
  private constructor(buffer: Buffer) {
    super(buffer);
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
}

/**
 * Create a zipped contents
 */
export const createContentsZip = async (
  pluginDir: string,
  manifest: ManifestInterface,
): Promise<Buffer> => {
  return new Promise((res) => {
    const output = new streamBuffers.WritableStreamBuffer();
    const zipFile = new yazl.ZipFile();
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

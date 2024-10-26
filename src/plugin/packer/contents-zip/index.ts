import type { ManifestInterface, ManifestStaticInterface } from "../manifest";
import { ManifestFactory } from "../manifest";
import { ZipFile } from "../zip";
import streamBuffers from "stream-buffers";
import path from "path";
import yazl from "yazl";

import _debug from "debug";
import { finished } from "node:stream/promises";
import { validateContentsZip } from "./validate";

const debug = _debug("contents-zip");

export interface ContentsZipInterface extends ZipFile {
  manifest(): Promise<ManifestInterface>;
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
    const manifestJson = await this.getFileAsString("manifest.json");
    return ManifestFactory.parseJson(manifestJson);
  }
}

/**
 * Create a zipped contents
 */
const createContentsZip = async (
  pluginDir: string,
  manifest: ManifestInterface,
): Promise<Buffer> => {
  const output = new streamBuffers.WritableStreamBuffer();
  const zipFile = new yazl.ZipFile();
  let size: any = null;
  zipFile.outputStream.pipe(output);
  manifest.sourceList().forEach((src) => {
    zipFile.addFile(path.join(pluginDir, src), src);
  });
  zipFile.end(undefined, ((finalSize: number) => {
    size = finalSize;
  }) as any);
  await finished(output);

  debug(`plugin.zip: ${size} bytes`);
  return output.getContents() as any;
};

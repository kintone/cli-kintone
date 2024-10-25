import type { ManifestInterface, ManifestStaticInterface } from "../manifest";
import { ManifestV1 } from "../manifest";
import { ZipFile } from "../zip";
import streamBuffers from "stream-buffers";
import path from "path";
import yazl from "yazl";

import _debug from "debug";
import { finished } from "node:stream/promises";
import { validateContentsZip } from "./validate";

const debug = _debug("contents-zip");

export interface ContentsZipInterface extends ZipFile {
  manifest(): Promise<{ path: string; manifest: ManifestInterface }>;
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

  public async manifest(): Promise<{
    path: string;
    manifest: ManifestInterface;
  }> {
    return extractManifestFromContentsZip(this, ManifestV1);
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

const extractManifestFromContentsZip = async (
  contentsZip: ContentsZipInterface,
  Manifest: ManifestStaticInterface,
) => {
  const fileLists = await contentsZip.fileList();
  const entries = await contentsZip.entries();
  const manifestList = fileLists.filter(
    (file) => path.basename(file) === "manifest.json",
  );
  if (manifestList.length === 0) {
    throw new Error("The zip file has no manifest.json");
  } else if (manifestList.length > 1) {
    throw new Error("The zip file has many manifest.json files");
  }
  const manifestPath = manifestList[0];
  const manifestEntry = entries.get(manifestPath);
  if (manifestEntry === undefined) {
    throw new Error("Failed to find manifest.json from the zip file");
  }
  const manifestJson = await contentsZip.getFileAsString(manifestPath);
  const manifest = Manifest.parseJson(manifestJson);
  return { path: manifestPath, manifest };
};

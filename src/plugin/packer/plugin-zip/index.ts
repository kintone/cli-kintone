import streamBuffers from "stream-buffers";
import yazl from "yazl";
import _debug from "debug";
import type { PrivateKeyInterface } from "../crypto";
import { PublicKey } from "../crypto";
import type { ContentsZipInterface } from "../contents-zip";
import { ContentsZip } from "../contents-zip";
import { finished } from "node:stream/promises";
import { ZipFileDriver } from "../driver";

const debug = _debug("plugin-zip");

export interface PluginZipInterface extends ZipFileDriver {}

export class PluginZip extends ZipFileDriver implements PluginZipInterface {
  private constructor(buffer: Buffer) {
    super(buffer);
  }

  public static async fromBuffer(buffer: Buffer) {
    return new PluginZip(buffer);
  }

  /**
   * Create plugin.zip
   */
  public static async build(
    contentsZip: ContentsZipInterface,
    privateKey: PrivateKeyInterface,
  ): Promise<PluginZip> {
    const buffer = await zip(contentsZip, privateKey);
    return new PluginZip(buffer);
  }

  public async manifest() {
    const contentsZip = await this.contentsZip();
    return contentsZip.manifest();
  }

  private async contentsZip(): Promise<ContentsZip> {
    const buffer = await this.readFile("contents.zip");
    return ContentsZip.fromBuffer(buffer);
  }

  async getPluginID(): Promise<string> {
    const buffer = await this.readFile("PUBKEY");
    const publicKey = PublicKey.importKey(buffer);
    return publicKey.uuid();
  }
}

/**
 * Create plugin.zip
 */
export const zip = async (
  contentsZip: ContentsZipInterface,
  privateKey: PrivateKeyInterface,
): Promise<Buffer> => {
  const publicKey = privateKey.exportPublicKey();
  const signature = privateKey.sign(contentsZip.buffer);

  debug(`zip(): start`);
  const output = new streamBuffers.WritableStreamBuffer();
  const zipFile = new yazl.ZipFile();
  zipFile.outputStream.pipe(output);
  zipFile.addBuffer(contentsZip.buffer, "contents.zip");
  zipFile.addBuffer(publicKey, "PUBKEY");
  zipFile.addBuffer(signature, "SIGNATURE");
  zipFile.end(undefined, ((finalSize: number) => {
    debug(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
  }) as any);
  await finished(output);
  debug(`zip(): output finish event`);
  return output.getContents() as any;
};

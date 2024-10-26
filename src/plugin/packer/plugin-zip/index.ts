import streamBuffers from "stream-buffers";
import yazl from "yazl";
import _debug from "debug";
import type { PrivateKeyInterface } from "../crypto";
import { PublicKey } from "../crypto";
import { ContentsZip } from "./contents-zip";
import { finished } from "node:stream/promises";
import type { DriverInterface } from "../driver";
import { ZipFileDriver } from "../driver";
import type { ManifestInterface } from "../manifest";

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
    manifest: ManifestInterface,
    privateKey: PrivateKeyInterface,
    driver: DriverInterface,
  ): Promise<PluginZip> {
    const contentsZip = await manifest.generateContentsZip(driver);
    return this.buildFromContentsZip(contentsZip, privateKey);
  }

  /**
   * Create plugin.zip from contents.zip
   */
  public static async buildFromContentsZip(
    contentsZip: ContentsZip,
    privateKey: PrivateKeyInterface,
  ): Promise<PluginZip> {
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

    return new PluginZip(output.getContents() as Buffer);
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

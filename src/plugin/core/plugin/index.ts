import yazl from "yazl";
import type { PrivateKeyInterface } from "../crypto";
import { PublicKey } from "../crypto";
import { ContentsZip } from "../contents";
import type { DriverInterface } from "../driver";
import { ZipFileDriver } from "../driver";
import type { ManifestInterface } from "../manifest";
import consumers from "node:stream/consumers";
import { logger } from "../../../utils/log";

export interface PluginInterface extends DriverInterface {}

export class PluginZip extends ZipFileDriver implements PluginInterface {
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

    logger.trace(`zip(): start`);
    const zipFile = new yazl.ZipFile();
    zipFile.addBuffer(contentsZip.buffer, "contents.zip");
    zipFile.addBuffer(publicKey, "PUBKEY");
    zipFile.addBuffer(signature, "SIGNATURE");
    zipFile.end(undefined, ((finalSize: number) => {
      logger.trace(`zip(): ZipFile end event: finalSize ${finalSize} bytes`);
    }) as any);

    const contents = await consumers.buffer(zipFile.outputStream);

    logger.trace(`zip(): output finish event`);
    return new PluginZip(contents);
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
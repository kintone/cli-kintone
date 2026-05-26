import type { PrivateKeyInterface } from "../crypto";
import { PublicKey } from "../crypto";
import { ContentsZip } from "../contents";
import type { DriverInterface } from "../driver";
import { ZipFileDriver } from "../driver";
import type { ManifestInterface } from "../manifest";
import { buildPluginZip } from "./zip";

/**
 * Plugin represents plugin includes Contents, public key, and signature.
 */
export interface PluginInterface extends DriverInterface {}

export class PluginZip extends ZipFileDriver implements PluginInterface {
  /**
   * Use static factory methods instead.
   * @private
   */
  private constructor(buffer: Buffer) {
    super(buffer);
  }

  public static async fromBuffer(buffer: Buffer) {
    return new PluginZip(buffer);
  }

  /**
   * Build plugin.zip
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
   * Build plugin.zip from contents.zip
   */
  public static async buildFromContentsZip(
    contentsZip: ContentsZip,
    privateKey: PrivateKeyInterface,
  ): Promise<PluginZip> {
    const buffer = await buildPluginZip(contentsZip, privateKey);
    return new PluginZip(buffer);
  }

  public async manifest(options: { skipValidation?: boolean } = {}) {
    const contentsZip = await this.contentsZip(options);
    return contentsZip.manifest();
  }

  private async contentsZip(
    options: { skipValidation?: boolean } = {},
  ): Promise<ContentsZip> {
    const buffer = await this.readFile("contents.zip");
    return ContentsZip.fromBuffer(buffer, options);
  }

  async getPluginID(): Promise<string> {
    const buffer = await this.readFile("PUBKEY");
    const publicKey = PublicKey.importKey(buffer);
    return publicKey.uuid();
  }
}

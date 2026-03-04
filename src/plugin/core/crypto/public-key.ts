import crypto from "crypto";
import { uuid } from "./uuid";

export interface PublicKeyInterface {
  /**
   * Export public key file
   * @returns {string} der formated public key
   */
  exportPublicKey(): Buffer;
  /**
   * Generate UUID for this key
   */
  uuid(): string;

  /**
   * Verify data with signature
   * @param data
   * @param signature
   */
  verify(data: Buffer, signature: Buffer): boolean;
}

export class PublicKey implements PublicKeyInterface {
  private readonly key: crypto.KeyObject;

  /**
   * Use static method importKey() instead.
   * @private
   */
  private constructor(key: crypto.KeyObject) {
    this.key = key;
  }

  /**
   * Import public key
   * @param key {string} pkcs8 der file
   */
  public static importKey(key: Buffer): PublicKey {
    const publicKey = crypto.createPublicKey({
      key,
      format: "der",
      type: "spki",
    });
    if (publicKey.type !== "public") {
      throw new Error("key must contain public key");
    }
    return new PublicKey(publicKey);
  }

  public exportPublicKey(): Buffer {
    return this.key.export({
      type: "spki",
      format: "der",
    }) as Buffer;
  }

  public uuid(): string {
    return uuid(this.exportPublicKey());
  }

  public verify(data: Buffer, signature: Buffer): boolean {
    return crypto.verify(
      "sha1",
      data,
      {
        key: this.key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      signature,
    );
  }
}

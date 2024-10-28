import RSA from "node-rsa";
import { uuid } from "./uuid";
import crypto from "crypto";

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
  private readonly key: RSA;

  /**
   * Use static method importKey() instead.
   * @private
   */
  private constructor(key: RSA) {
    this.key = key;
  }

  /**
   * Import public key
   * @param key {string} pkcs8 der file
   */
  public static importKey(key: Buffer): PublicKey {
    const rsa = new RSA(key, "pkcs8-public-der");
    if (rsa.isPrivate()) {
      throw new Error("key contains private key");
    }
    if (!rsa.isPublic()) {
      throw new Error("key must contain public key");
    }
    return new PublicKey(rsa);
  }

  public exportPublicKey(): Buffer {
    return this.key.exportKey("pkcs8-public-der");
  }

  public uuid(): string {
    return uuid(this.exportPublicKey());
  }

  public verify(data: Buffer, signature: Buffer): boolean {
    const pem = this.key.exportKey("pkcs1-public-pem");
    const verifier = crypto.createVerify("RSA-SHA1");
    verifier.update(data);

    return verifier.verify(pem, signature);
  }
}

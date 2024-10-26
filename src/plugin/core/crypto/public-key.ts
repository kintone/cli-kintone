import RSA from "node-rsa";
import { uuid } from "./uuid";

export interface PublicKeyInterface {
  exportPublicKey(): Buffer;
  uuid(): string;
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

  /**
   * Export public key
   */
  public exportPublicKey(): Buffer {
    return this.key.exportKey("pkcs8-public-der");
  }

  /**
   * Generate UUID for this key
   */
  public uuid(): string {
    return uuid(this.exportPublicKey());
  }
}

import crypto from "crypto";
import { uuid } from "./uuid";
import { sign } from "./sign";

/**
 * PrivateKey represents private key to pack, sign, and verify plugin
 */
export interface PrivateKeyInterface {
  /**
   * Export private key file
   * @return {string} ppk formated private key
   */
  exportPrivateKey(): string;
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
   * Generate signature for the contents
   * @param contents {Buffer}
   */
  sign(contents: Buffer): Buffer;
}

export class PrivateKey implements PrivateKeyInterface {
  private readonly key: crypto.KeyObject;

  /**
   * Use static method generateKey() or importKey() instead.
   * @private
   */
  private constructor(key: crypto.KeyObject) {
    this.key = key;
  }

  /**
   * Generate new private key
   */
  public static generateKey(): PrivateKey {
    const { privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 1024,
    });
    return new PrivateKey(privateKey);
  }

  /**
   * Import private key
   * @param key {string} utf8 encoded ppk file
   */
  public static importKey(key: string): PrivateKey {
    const privateKey = crypto.createPrivateKey({
      key,
      format: "pem",
    });
    return new PrivateKey(privateKey);
  }

  public exportPrivateKey(): string {
    const pem = this.key.export({
      type: "pkcs1",
      format: "pem",
    }) as string;
    // Ensure trailing newline for compatibility
    return pem.endsWith("\n") ? pem : pem + "\n";
  }

  public exportPublicKey(): Buffer {
    const publicKey = crypto.createPublicKey(this.key);
    return publicKey.export({
      type: "spki",
      format: "der",
    }) as Buffer;
  }

  public uuid(): string {
    return uuid(this.exportPublicKey());
  }

  public sign(contents: Buffer): Buffer {
    return sign(contents, this.exportPrivateKey());
  }
}

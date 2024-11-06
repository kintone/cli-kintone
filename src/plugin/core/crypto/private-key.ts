import RSA from "node-rsa";
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
  private readonly key: RSA;

  /**
   * Use static method generateKey() or importKey() instead.
   * @private
   */
  private constructor(key: RSA) {
    this.key = key;
  }

  /**
   * Generate new private key
   */
  public static generateKey(): PrivateKey {
    return new PrivateKey(new RSA({ b: 1024 }));
  }

  /**
   * Import private key
   * @param key {string} utf8 encoded ppk file
   */
  public static importKey(key: string): PrivateKey {
    return new PrivateKey(new RSA(key));
  }

  public exportPrivateKey(): string {
    return this.key.exportKey("pkcs1-private") + "\n";
  }

  public exportPublicKey(): Buffer {
    return this.key.exportKey("pkcs8-public-der");
  }

  public uuid(): string {
    return uuid(this.exportPublicKey());
  }

  public sign(contents: Buffer): Buffer {
    return sign(contents, this.exportPrivateKey());
  }
}

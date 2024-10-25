import RSA from "node-rsa";
import { uuid } from "./uuid";
import { sign } from "./sign";

export interface PrivateKeyInterface {
  exportPrivateKey(): string;
  exportPublicKey(): Buffer;
  uuid(): string;
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

  /**
   * Export private key
   * @return {string} ppk format string
   */
  public exportPrivateKey(): string {
    return this.key.exportKey("pkcs1-private") + "\n";
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

  /**
   * Generate signature for the contents
   * @param contents {Buffer}
   */
  public sign(contents: Buffer): Buffer {
    return sign(contents, this.exportPrivateKey());
  }
}

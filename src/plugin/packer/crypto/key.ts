import RSA from "node-rsa";
import { uuid } from "./uuid";
import { sign } from "./sign";

interface PrivateKeyInterface {
  // static generateKey(): PrivateKeyInterface;
  // static importKey(privateKey: string): PrivateKeyInterface;
  exportPrivateKey(): string;
  exportPublicKey(): Buffer;
  uuid(): string;
  sign(contents: Buffer): Buffer;
}

export class PrivateKey implements PrivateKeyInterface {
  private key: RSA;

  /**
   * Use static method generateKey() or importKey() instead.
   * @private
   */
  private constructor() {
    this.key = "" as any;
  }

  /**
   * Generate new private key
   */
  public static generateKey(): PrivateKey {
    const privateKey = new PrivateKey();
    privateKey.key = new RSA({ b: 1024 });
    return privateKey;
  }

  /**
   * Import private key
   * @param key {string} utf8 encoded ppk file
   */
  public static importKey(key: string): PrivateKey {
    const privateKey = new PrivateKey();
    privateKey.key = new RSA(key);
    return privateKey;
  }

  /**
   * Export private key
   * @return {string} ppk format string
   */
  public exportPrivateKey(): string {
    return this.key.exportKey("pkcs1-private");
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

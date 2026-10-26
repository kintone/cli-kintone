import type { PrivateKey } from "../../core";
import type { LocalPrivateKeyRepository } from "../usecases/interface";
import { PrivateKeyFileExistsError } from "../usecases/keygen/error";

export class LocalPrivateKeyRepositoryMock implements LocalPrivateKeyRepository {
  readonly files = new Map<string, string>();

  private readonly output: string | undefined;

  constructor(output?: string) {
    this.output = output;
  }

  async save(privateKey: PrivateKey) {
    const filePath = this.output ?? `${privateKey.uuid()}.ppk`;
    if (this.files.has(filePath)) {
      throw new PrivateKeyFileExistsError(filePath);
    }

    this.files.set(filePath, privateKey.exportPrivateKey());
    return filePath;
  }
}

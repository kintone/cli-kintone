import type { PrivateKeyRepository } from "../usecases/interface";

export class LocalPrivateKeyRepositoryMock implements PrivateKeyRepository {
  readonly files = new Map<string, string>();

  async exists(filePath: string) {
    return this.files.has(filePath);
  }

  async save(filePath: string, privateKey: string) {
    this.files.set(filePath, privateKey);
  }
}

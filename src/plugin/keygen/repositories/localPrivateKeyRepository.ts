import fs from "fs/promises";
import path from "path";
import type { PrivateKey } from "../../core";
import type { PrivateKeyRepository } from "../usecases/interface";
import { PrivateKeyFileExistsError } from "../usecases/keygen/error";
import { isFile } from "../../../utils/file";

export class LocalPrivateKeyRepository implements PrivateKeyRepository {
  private readonly output: string | undefined;

  constructor(output: string | undefined) {
    this.output = output;
  }

  async save(privateKey: PrivateKey) {
    const filePath = path.resolve(
      this.output ? this.output : `./${privateKey.uuid()}.ppk`,
    );
    if (await isFile(filePath)) {
      throw new PrivateKeyFileExistsError(filePath);
    }

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, privateKey.exportPrivateKey(), "utf8");
    return filePath;
  }
}

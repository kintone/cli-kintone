import fs from "fs/promises";
import path from "path";
import type { PrivateKeyRepository } from "../usecases/interface";
import { isFile } from "../../../utils/file";

export class LocalPrivateKeyRepository implements PrivateKeyRepository {
  async exists(filePath: string) {
    return isFile(filePath);
  }

  async save(filePath: string, privateKey: string) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, privateKey, "utf8");
  }
}

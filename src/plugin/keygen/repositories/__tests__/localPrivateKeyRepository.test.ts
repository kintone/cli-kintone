import fs from "fs/promises";
import os from "os";
import path from "path";
import { LocalPrivateKeyRepository } from "../localPrivateKeyRepository";

describe("LocalPrivateKeyRepository", () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-keygen-"),
    );
  });

  afterEach(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  describe("exists", () => {
    it("should return true when the file exists", async () => {
      const filePath = path.join(workDir, "private.ppk");
      await fs.writeFile(filePath, "existing content", "utf8");

      await expect(
        new LocalPrivateKeyRepository().exists(filePath),
      ).resolves.toBe(true);
    });

    it("should return false when the file does not exist", async () => {
      await expect(
        new LocalPrivateKeyRepository().exists(
          path.join(workDir, "private.ppk"),
        ),
      ).resolves.toBe(false);
    });
  });

  describe("save", () => {
    it("should write the private key to the file", async () => {
      const filePath = path.join(workDir, "private.ppk");

      await new LocalPrivateKeyRepository().save(filePath, "private key");

      await expect(fs.readFile(filePath, "utf8")).resolves.toBe("private key");
    });

    it("should create the parent directories of the file", async () => {
      const filePath = path.join(workDir, "nested", "dir", "private.ppk");

      await new LocalPrivateKeyRepository().save(filePath, "private key");

      await expect(fs.readFile(filePath, "utf8")).resolves.toBe("private key");
    });
  });
});

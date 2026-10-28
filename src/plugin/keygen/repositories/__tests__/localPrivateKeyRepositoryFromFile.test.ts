import { vi } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { PrivateKey } from "../../../core";
import { PrivateKeyFileExistsError } from "../../usecases/keygen/error";
import { LocalPrivateKeyRepositoryFromFile } from "../localPrivateKeyRepositoryFromFile";

describe("LocalPrivateKeyRepositoryFromFile", () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-keygen-"),
    );
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should write the private key to the specified path and return the path", async () => {
    const outputPath = path.join(workDir, "private.ppk");
    const privateKey = PrivateKey.generateKey();

    const savedPath = await new LocalPrivateKeyRepositoryFromFile(
      outputPath,
    ).save(privateKey);

    expect(savedPath).toBe(outputPath);
    await expect(fs.readFile(outputPath, "utf8")).resolves.toBe(
      privateKey.exportPrivateKey(),
    );
  });

  it("should write the private key to <plugin_id>.ppk in the cwd when the output is omitted", async () => {
    vi.spyOn(process, "cwd").mockReturnValue(workDir);
    const privateKey = PrivateKey.generateKey();

    const savedPath = await new LocalPrivateKeyRepositoryFromFile(
      undefined,
    ).save(privateKey);

    expect(savedPath).toBe(path.join(workDir, `${privateKey.uuid()}.ppk`));
    await expect(fs.readFile(savedPath, "utf8")).resolves.toBe(
      privateKey.exportPrivateKey(),
    );
  });

  it("should create the parent directories of the output", async () => {
    const outputPath = path.join(workDir, "nested", "dir", "private.ppk");

    await new LocalPrivateKeyRepositoryFromFile(outputPath).save(
      PrivateKey.generateKey(),
    );

    await expect(fs.readFile(outputPath, "utf8")).resolves.toMatch(
      /^-----BEGIN RSA PRIVATE KEY-----\n/,
    );
  });

  it("should throw PrivateKeyFileExistsError without overwriting when the output already exists", async () => {
    const outputPath = path.join(workDir, "private.ppk");
    await fs.writeFile(outputPath, "existing content", "utf8");

    await expect(
      new LocalPrivateKeyRepositoryFromFile(outputPath).save(
        PrivateKey.generateKey(),
      ),
    ).rejects.toSatisfy((thrownError) => {
      expect(thrownError).toBeInstanceOf(PrivateKeyFileExistsError);
      expect(thrownError).toMatchObject({
        cause: `File ${outputPath} already exists.`,
      });
      return true;
    });
    await expect(fs.readFile(outputPath, "utf8")).resolves.toBe(
      "existing content",
    );
  });
});

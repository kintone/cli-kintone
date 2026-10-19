import path from "path";
import { PrivateKey } from "../../../../core";
import { LocalPrivateKeyRepositoryMock } from "../../../repositories/localPrivateKeyRepositoryMock";
import { keygen } from "../../keygen";
import { PrivateKeyFileExistsError } from "../../keygen/error";

describe("keygen", () => {
  it("should save the private key to the specified path", async () => {
    const repositoryMock = new LocalPrivateKeyRepositoryMock();
    const outputPath = path.resolve("private.ppk");

    await keygen(repositoryMock, "private.ppk");

    expect([...repositoryMock.files.keys()]).toStrictEqual([outputPath]);
    const key = repositoryMock.files.get(outputPath) ?? "";
    expect(() => PrivateKey.importKey(key)).not.toThrow();
  });

  it("should save the private key to <plugin_id>.ppk in the cwd when the output is omitted", async () => {
    const repositoryMock = new LocalPrivateKeyRepositoryMock();

    await keygen(repositoryMock, undefined);

    const [[outputPath, key]] = [...repositoryMock.files.entries()];
    expect(outputPath).toBe(
      path.resolve(`${PrivateKey.importKey(key).uuid()}.ppk`),
    );
  });

  it("should throw PrivateKeyFileExistsError without overwriting when the output already exists", async () => {
    const repositoryMock = new LocalPrivateKeyRepositoryMock();
    const outputPath = path.resolve("private.ppk");
    repositoryMock.files.set(outputPath, "existing content");

    await expect(keygen(repositoryMock, outputPath)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PrivateKeyFileExistsError);
        expect(thrownError).toMatchObject({
          cause: `File ${outputPath} already exists.`,
        });
        return true;
      },
    );
    expect(repositoryMock.files.get(outputPath)).toBe("existing content");
  });
});

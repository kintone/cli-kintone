import { PrivateKey } from "../../../../core";
import { LocalPrivateKeyRepositoryMock } from "../../../repositories/localPrivateKeyRepositoryMock";
import { keygen } from "../../keygen";
import { PrivateKeyFileExistsError } from "../../keygen/error";

describe("keygen", () => {
  it("should save a generated private key to the repository", async () => {
    const repositoryMock = new LocalPrivateKeyRepositoryMock("private.ppk");

    await keygen(repositoryMock);

    expect([...repositoryMock.files.keys()]).toStrictEqual(["private.ppk"]);
    const key = repositoryMock.files.get("private.ppk") ?? "";
    expect(() => PrivateKey.importKey(key)).not.toThrow();
  });

  it("should throw PrivateKeyFileExistsError without overwriting when the output already exists", async () => {
    const repositoryMock = new LocalPrivateKeyRepositoryMock("private.ppk");
    repositoryMock.files.set("private.ppk", "existing content");

    await expect(keygen(repositoryMock)).rejects.toSatisfy((thrownError) => {
      expect(thrownError).toBeInstanceOf(PrivateKeyFileExistsError);
      expect(thrownError).toMatchObject({
        cause: "File private.ppk already exists.",
      });
      return true;
    });
    expect(repositoryMock.files.get("private.ppk")).toBe("existing content");
  });
});

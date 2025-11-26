import assert from "assert";
import { mkdtemp, writeFile, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { updatePackageJson } from "../../template/pacakge-json";

describe("template/package-json", () => {
  describe("updatePackageJson", () => {
    let tempDir: string;
    let packageJsonPath: string;

    beforeEach(async () => {
      // 一時ディレクトリとダミーpackage.jsonを作成
      tempDir = await mkdtemp(join(tmpdir(), "plugin-init-test-"));
      packageJsonPath = join(tempDir, "package.json");

      // ダミーのpackage.jsonを作成
      const dummyPackageJson = {
        name: "original-name",
        version: "1.0.0",
        scripts: {
          build: "webpack",
          start: "webpack --watch",
        },
        dependencies: {
          react: "^18.0.0",
        },
        devDependencies: {
          webpack: "^5.0.0",
        },
      };
      await writeFile(
        packageJsonPath,
        JSON.stringify(dummyPackageJson, null, 2),
      );
    });

    afterEach(async () => {
      // クリーンアップ
      await rm(tempDir, { recursive: true, force: true });
    });

    it("package.jsonのnameフィールドを更新する", async () => {
      await updatePackageJson({
        packageJsonPath,
        patch: { name: "my-awesome-plugin" },
      });

      const updatedPackageJson = JSON.parse(
        await readFile(packageJsonPath, "utf-8"),
      );

      assert.strictEqual(updatedPackageJson.name, "my-awesome-plugin");
    });

    it("既存のpackage.jsonフィールドを保持する", async () => {
      await updatePackageJson({
        packageJsonPath,
        patch: { name: "new-name" },
      });

      const updatedPackageJson = JSON.parse(
        await readFile(packageJsonPath, "utf-8"),
      );

      // 既存フィールドが保持されていることを確認
      assert.strictEqual(updatedPackageJson.version, "1.0.0");
      assert.deepStrictEqual(updatedPackageJson.scripts, {
        build: "webpack",
        start: "webpack --watch",
      });
      assert.deepStrictEqual(updatedPackageJson.dependencies, {
        react: "^18.0.0",
      });
      assert.deepStrictEqual(updatedPackageJson.devDependencies, {
        webpack: "^5.0.0",
      });
    });

    it("フォーマットされたJSON(インデント2)で書き込む", async () => {
      await updatePackageJson({
        packageJsonPath,
        patch: { name: "test-plugin" },
      });

      const fileContent = await readFile(packageJsonPath, "utf-8");

      // インデント2でフォーマットされていることを確認
      const expectedFormatting = JSON.stringify(
        JSON.parse(fileContent),
        null,
        2,
      );
      assert.strictEqual(fileContent, expectedFormatting);
    });

    it("不正なJSONファイルでエラーをスローする", async () => {
      // 不正なJSONを書き込む
      await writeFile(packageJsonPath, "{ invalid json }");

      await assert.rejects(async () => {
        await updatePackageJson({
          packageJsonPath,
          patch: { name: "test-plugin" },
        });
      });
    });

    it("存在しないファイルパスでエラーをスローする", async () => {
      const nonExistentPath = join(tempDir, "non-existent.json");

      await assert.rejects(async () => {
        await updatePackageJson({
          packageJsonPath: nonExistentPath,
          patch: { name: "test-plugin" },
        });
      });
    });
  });
});

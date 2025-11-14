import assert from "assert";
import { mkdtemp, writeFile, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { rimraf } from "rimraf";
import { updateManifestsForAnswers } from "../../template/manifest";
import type { ManifestJsonObjectForUpdate } from "../../template/manifest";

describe("template/manifest", () => {
  describe("updateManifestsForAnswers", () => {
    let tempDir: string;
    let manifestPath: string;

    beforeEach(async () => {
      // 一時ディレクトリとダミーmanifest.jsonを作成
      tempDir = await mkdtemp(join(tmpdir(), "plugin-init-test-"));
      manifestPath = join(tempDir, "manifest.json");

      // ダミーのmanifest.jsonを作成
      const dummyManifest = {
        manifest_version: 1,
        version: 1,
        type: "APP" as const,
        name: {
          en: "Original Name",
        },
        desktop: {
          js: ["js/desktop.js"],
          css: ["css/desktop.css"],
        },
        icon: "image/icon.png",
      };
      await writeFile(manifestPath, JSON.stringify(dummyManifest, null, 2));
    });

    afterEach(async () => {
      // クリーンアップ
      await rimraf(tempDir);
    });

    it("name, description, homepage_urlを正しく更新する", async () => {
      const answers: ManifestJsonObjectForUpdate = {
        name: {
          en: "New Plugin Name",
          ja: "新しいプラグイン名",
        },
        description: {
          en: "New description",
        },
        homepage_url: {
          en: "https://example.com",
        },
      };

      await updateManifestsForAnswers({
        manifestPath,
        answers,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      assert.strictEqual(updatedManifest.name.en, "New Plugin Name");
      assert.strictEqual(updatedManifest.name.ja, "新しいプラグイン名");
      assert.strictEqual(updatedManifest.description.en, "New description");
      assert.strictEqual(
        updatedManifest.homepage_url.en,
        "https://example.com",
      );
    });

    it("既存のmanifest.jsonフィールドを保持する", async () => {
      const answers: ManifestJsonObjectForUpdate = {
        name: {
          en: "New Name",
        },
      };

      await updateManifestsForAnswers({
        manifestPath,
        answers,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      // 既存フィールドが保持されていることを確認
      assert.strictEqual(updatedManifest.manifest_version, 1);
      assert.strictEqual(updatedManifest.version, 1);
      assert.strictEqual(updatedManifest.type, "APP");
      assert.deepStrictEqual(updatedManifest.desktop, {
        js: ["js/desktop.js"],
        css: ["css/desktop.css"],
      });
      assert.strictEqual(updatedManifest.icon, "image/icon.png");
    });

    it("多言語フィールド(ja, zh, es, etc)を正しく設定する", async () => {
      const answers: ManifestJsonObjectForUpdate = {
        name: {
          en: "Plugin",
          ja: "プラグイン",
          zh: "插件",
          es: "Complemento",
        },
      };

      await updateManifestsForAnswers({
        manifestPath,
        answers,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      assert.strictEqual(updatedManifest.name.en, "Plugin");
      assert.strictEqual(updatedManifest.name.ja, "プラグイン");
      assert.strictEqual(updatedManifest.name.zh, "插件");
      assert.strictEqual(updatedManifest.name.es, "Complemento");
    });

    it("フォーマットされたJSON(インデント2)で書き込む", async () => {
      const answers: ManifestJsonObjectForUpdate = {
        name: {
          en: "Test",
        },
      };

      await updateManifestsForAnswers({
        manifestPath,
        answers,
      });

      const fileContent = await readFile(manifestPath, "utf-8");

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
      await writeFile(manifestPath, "{ invalid json }");

      const answers: ManifestJsonObjectForUpdate = {
        name: {
          en: "Test",
        },
      };

      await assert.rejects(async () => {
        await updateManifestsForAnswers({
          manifestPath,
          answers,
        });
      });
    });

    it("存在しないファイルパスでエラーをスローする", async () => {
      const nonExistentPath = join(tempDir, "non-existent.json");

      const answers: ManifestJsonObjectForUpdate = {
        name: {
          en: "Test",
        },
      };

      await assert.rejects(async () => {
        await updateManifestsForAnswers({
          manifestPath: nonExistentPath,
          answers,
        });
      });
    });
  });
});

import assert from "assert";
import { mkdtemp, writeFile, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { updateManifests } from "../../template/manifest";
import type { ManifestPatch } from "../../template/manifest";

describe("template/manifest", () => {
  describe("updateManifests", () => {
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
      await rm(tempDir, { recursive: true, force: true });
    });

    it("name, description, homepage_urlを正しく更新する", async () => {
      const patch: ManifestPatch = {
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

      await updateManifests({
        manifestPath,
        patch,
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
      const patch: ManifestPatch = {
        name: {
          en: "New Name",
        },
      };

      await updateManifests({
        manifestPath,
        patch,
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
      const patch: ManifestPatch = {
        name: {
          en: "Plugin",
          ja: "プラグイン",
          zh: "插件",
          es: "Complemento",
        },
      };

      await updateManifests({
        manifestPath,
        patch,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      assert.strictEqual(updatedManifest.name.en, "Plugin");
      assert.strictEqual(updatedManifest.name.ja, "プラグイン");
      assert.strictEqual(updatedManifest.name.zh, "插件");
      assert.strictEqual(updatedManifest.name.es, "Complemento");
    });

    it("フォーマットされたJSON(インデント2)で書き込む", async () => {
      const patch: ManifestPatch = {
        name: {
          en: "Test",
        },
      };

      await updateManifests({
        manifestPath,
        patch,
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

      const patch: ManifestPatch = {
        name: {
          en: "Test",
        },
      };

      await assert.rejects(async () => {
        await updateManifests({
          manifestPath,
          patch,
        });
      });
    });

    it("存在しないファイルパスでエラーをスローする", async () => {
      const nonExistentPath = join(tempDir, "non-existent.json");

      const patch: ManifestPatch = {
        name: {
          en: "Test",
        },
      };

      await assert.rejects(async () => {
        await updateManifests({
          manifestPath: nonExistentPath,
          patch,
        });
      });
    });

    it("空文字のプロパティは既存の値を削除する", async () => {
      // 既存のmanifestにjaを追加
      const initialManifest = {
        manifest_version: 1,
        version: 1,
        type: "APP",
        name: {
          en: "Original Name",
          ja: "元の名前",
        },
        icon: "image/icon.png",
      };
      await writeFile(manifestPath, JSON.stringify(initialManifest, null, 2));

      const patch: ManifestPatch = {
        name: {
          en: "New Name",
          ja: "",
        },
      };

      await updateManifests({
        manifestPath,
        patch,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      assert.strictEqual(updatedManifest.name.en, "New Name");
      assert.strictEqual(updatedManifest.name.ja, undefined);
    });

    it("すべてのネストプロパティが空の場合、親プロパティも削除する", async () => {
      const initialManifest = {
        manifest_version: 1,
        version: 1,
        type: "APP",
        name: {
          en: "Name",
        },
        homepage_url: {
          en: "https://example.com",
        },
        icon: "image/icon.png",
      };
      await writeFile(manifestPath, JSON.stringify(initialManifest, null, 2));

      const patch: ManifestPatch = {
        homepage_url: {
          en: "",
        },
      };

      await updateManifests({
        manifestPath,
        patch,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      assert.strictEqual(updatedManifest.homepage_url, undefined);
    });

    it("既存の他言語プロパティを保持しつつ空文字で一部を削除する", async () => {
      const initialManifest = {
        manifest_version: 1,
        version: 1,
        type: "APP",
        name: {
          en: "Name",
          ja: "名前",
          zh: "名称",
        },
        icon: "image/icon.png",
      };
      await writeFile(manifestPath, JSON.stringify(initialManifest, null, 2));

      const patch: ManifestPatch = {
        name: {
          ja: "",
        },
      };

      await updateManifests({
        manifestPath,
        patch,
      });

      const updatedManifest = JSON.parse(await readFile(manifestPath, "utf-8"));

      assert.strictEqual(updatedManifest.name.en, "Name");
      assert.strictEqual(updatedManifest.name.ja, undefined);
      assert.strictEqual(updatedManifest.name.zh, "名称");
    });
  });
});

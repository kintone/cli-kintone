import assert from "assert";
import { mkdtemp, writeFile, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { rimraf } from "rimraf";
import { setupTemplate } from "../template";
import type { ManifestJsonObjectForUpdate } from "../template/manifest";

// GitHub関連の関数をモック
jest.mock("../template/github");

describe("template", () => {
  describe("setupTemplate", () => {
    let tempDir: string;

    beforeEach(async () => {
      // 一時ディレクトリを作成
      tempDir = await mkdtemp(join(tmpdir(), "plugin-init-test-"));
      jest.clearAllMocks();
    });

    afterEach(async () => {
      // クリーンアップ
      await rimraf(tempDir);
    });

    it("存在しないテンプレート名でエラーをスローする", async () => {
      // isDefaultTemplateExistsがfalseを返すようモック
      const { isDefaultTemplateExists } = require("../template/github");
      isDefaultTemplateExists.mockResolvedValue(false);

      const answers: ManifestJsonObjectForUpdate = {
        name: { en: "Test" },
        description: { en: "Test" },
      };

      const pluginDir = join(tempDir, "test-plugin");

      await assert.rejects(
        async () => {
          await setupTemplate({
            templateName: "non-existent",
            outputDir: pluginDir,
            packageName: "test-plugin",
            answers,
          });
        },
        {
          message: "template not found",
        },
      );
    });

    it("JavaScriptテンプレートで完全なセットアップが完了する", async () => {
      const {
        isDefaultTemplateExists,
        downloadAndExtractTemplate,
      } = require("../template/github");

      // isDefaultTemplateExistsがtrueを返す
      isDefaultTemplateExists.mockResolvedValue(true);

      const pluginDir = join(tempDir, "my-plugin");

      // downloadAndExtractTemplateが成功し、ダミーファイルを作成
      downloadAndExtractTemplate.mockImplementation(
        async ({ outputDir }: { outputDir: string }) => {
          // ダミーのmanifest.jsonを作成
          await writeFile(
            join(outputDir, "manifest.json"),
            JSON.stringify(
              {
                manifest_version: 1,
                version: 1,
                type: "APP",
                name: { en: "Original" },
                desktop: { js: ["js/desktop.js"] },
                icon: "image/icon.png",
              },
              null,
              2,
            ),
          );

          // ダミーのpackage.jsonを作成
          await writeFile(
            join(outputDir, "package.json"),
            JSON.stringify(
              {
                name: "original-name",
                version: "1.0.0",
              },
              null,
              2,
            ),
          );
        },
      );

      const answers: ManifestJsonObjectForUpdate = {
        name: { en: "My Plugin" },
        description: { en: "Test plugin" },
      };

      await setupTemplate({
        templateName: "javascript",
        outputDir: pluginDir,
        packageName: "my-plugin",
        answers,
      });

      // manifest.jsonが更新されていることを確認
      const manifest = JSON.parse(
        await readFile(join(pluginDir, "manifest.json"), "utf-8"),
      );
      assert.strictEqual(manifest.name.en, "My Plugin");
      assert.strictEqual(manifest.description.en, "Test plugin");

      // package.jsonが更新されていることを確認
      const packageJson = JSON.parse(
        await readFile(join(pluginDir, "package.json"), "utf-8"),
      );
      assert.strictEqual(packageJson.name, "my-plugin");

      // 呼び出し順序を確認
      expect(isDefaultTemplateExists).toHaveBeenCalledWith("javascript");
      expect(downloadAndExtractTemplate).toHaveBeenCalledWith({
        templateName: "javascript",
        outputDir: pluginDir,
      });
    });

    it("TypeScriptテンプレートで完全なセットアップが完了する", async () => {
      const {
        isDefaultTemplateExists,
        downloadAndExtractTemplate,
      } = require("../template/github");

      isDefaultTemplateExists.mockResolvedValue(true);

      const pluginDir = join(tempDir, "ts-plugin");

      downloadAndExtractTemplate.mockImplementation(
        async ({ outputDir }: { outputDir: string }) => {
          await writeFile(
            join(outputDir, "manifest.json"),
            JSON.stringify(
              {
                manifest_version: 1,
                version: 1,
                type: "APP",
                name: { en: "Original" },
                desktop: { js: ["js/desktop.js"] },
                icon: "image/icon.png",
              },
              null,
              2,
            ),
          );

          await writeFile(
            join(outputDir, "package.json"),
            JSON.stringify(
              {
                name: "original-name",
                version: "1.0.0",
              },
              null,
              2,
            ),
          );
        },
      );

      const answers: ManifestJsonObjectForUpdate = {
        name: { en: "TS Plugin" },
        description: { en: "TypeScript plugin" },
      };

      await setupTemplate({
        templateName: "typescript",
        outputDir: pluginDir,
        packageName: "ts-plugin",
        answers,
      });

      const manifest = JSON.parse(
        await readFile(join(pluginDir, "manifest.json"), "utf-8"),
      );
      assert.strictEqual(manifest.name.en, "TS Plugin");

      const packageJson = JSON.parse(
        await readFile(join(pluginDir, "package.json"), "utf-8"),
      );
      assert.strictEqual(packageJson.name, "ts-plugin");
    });
  });
});

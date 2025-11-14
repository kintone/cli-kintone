/* eslint-disable n/no-unsupported-features/node-builtins */
import assert from "assert";
import { mkdtemp, access } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { rimraf } from "rimraf";
import {
  isDefaultTemplateExists,
  downloadAndExtractTemplate,
} from "../../template/github";
import {
  mockFetchSuccess,
  mockFetchNotFound,
  mockFetchError,
  mockFetchWithTarball,
} from "../helpers/mockFetch";

describe("template/github", () => {
  describe("isDefaultTemplateExists", () => {
    beforeEach(() => {
      // fetch APIをモック
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("存在するテンプレート名でtrueを返す", async () => {
      mockFetchSuccess();

      const result = await isDefaultTemplateExists("javascript");

      assert.strictEqual(result, true);
      assert(global.fetch);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("api.github.com"),
        expect.objectContaining({
          method: "HEAD",
        }),
      );
    });

    it("存在しないテンプレート名でfalseを返す", async () => {
      mockFetchNotFound();

      const result = await isDefaultTemplateExists("non-existent");

      assert.strictEqual(result, false);
    });

    it("GitHub APIエラー時にfalseを返す", async () => {
      mockFetchError();

      const result = await isDefaultTemplateExists("javascript");

      assert.strictEqual(result, false);
    });

    it("GITHUB_TOKEN環境変数が設定されている場合、認証ヘッダーを使用する", async () => {
      process.env.GITHUB_TOKEN = "test-token";
      mockFetchSuccess();

      await isDefaultTemplateExists("javascript");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      );

      delete process.env.GITHUB_TOKEN;
    });
  });

  describe("downloadAndExtractTemplate", () => {
    let tempDir: string;

    beforeEach(async () => {
      // 一時ディレクトリを作成
      tempDir = await mkdtemp(join(tmpdir(), "plugin-init-test-"));
      // fetch APIをモック
      global.fetch = jest.fn();
    });

    afterEach(async () => {
      // 一時ディレクトリを削除
      await rimraf(tempDir);
      jest.restoreAllMocks();
    });

    it("JavaScriptテンプレートを正しくダウンロード・展開する", async () => {
      await mockFetchWithTarball("javascript");

      await downloadAndExtractTemplate({
        templateName: "javascript",
        outputDir: tempDir,
      });

      // 期待されるファイルが展開されていることを確認
      const manifestExists = await access(join(tempDir, "manifest.json"))
        .then(() => true)
        .catch(() => false);
      const packageJsonExists = await access(join(tempDir, "package.json"))
        .then(() => true)
        .catch(() => false);
      const cssExists = await access(join(tempDir, "css"))
        .then(() => true)
        .catch(() => false);
      const jsExists = await access(join(tempDir, "js"))
        .then(() => true)
        .catch(() => false);
      const htmlExists = await access(join(tempDir, "html"))
        .then(() => true)
        .catch(() => false);
      const imageExists = await access(join(tempDir, "image"))
        .then(() => true)
        .catch(() => false);

      assert(manifestExists, "manifest.json should exist");
      assert(packageJsonExists, "package.json should exist");
      assert(cssExists, "css directory should exist");
      assert(jsExists, "js directory should exist");
      assert(htmlExists, "html directory should exist");
      assert(imageExists, "image directory should exist");
    });

    it("TypeScriptテンプレートを正しくダウンロード・展開する", async () => {
      await mockFetchWithTarball("typescript");

      await downloadAndExtractTemplate({
        templateName: "typescript",
        outputDir: tempDir,
      });

      // 期待されるファイルが展開されていることを確認
      const manifestExists = await access(join(tempDir, "manifest.json"))
        .then(() => true)
        .catch(() => false);
      const packageJsonExists = await access(join(tempDir, "package.json"))
        .then(() => true)
        .catch(() => false);
      const cssExists = await access(join(tempDir, "css"))
        .then(() => true)
        .catch(() => false);
      const srcExists = await access(join(tempDir, "src"))
        .then(() => true)
        .catch(() => false);
      const htmlExists = await access(join(tempDir, "html"))
        .then(() => true)
        .catch(() => false);
      const imageExists = await access(join(tempDir, "image"))
        .then(() => true)
        .catch(() => false);

      assert(manifestExists, "manifest.json should exist");
      assert(packageJsonExists, "package.json should exist");
      assert(cssExists, "css directory should exist");
      assert(srcExists, "src directory should exist");
      assert(htmlExists, "html directory should exist");
      assert(imageExists, "image directory should exist");
    });

    it("ダウンロード失敗時にエラーをスローする", async () => {
      mockFetchError();

      await assert.rejects(
        async () => {
          await downloadAndExtractTemplate({
            templateName: "javascript",
            outputDir: tempDir,
          });
        },
        {
          message: "Network error",
        },
      );
    });
  });
});

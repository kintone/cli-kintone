/* eslint-disable n/no-unsupported-features/node-builtins */
import assert from "assert";
import { mkdtemp, access, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import {
  downloadAndExtractFromUrl,
  type TemplateSource,
} from "../../template/downloader";
import { mockFetchWithTarball, mockFetchError } from "../helpers/mockFetch";

describe("template/downloader", () => {
  describe("downloadAndExtractFromUrl", () => {
    let tempDir: string;

    beforeEach(async () => {
      // 一時ディレクトリを作成
      tempDir = await mkdtemp(join(tmpdir(), "plugin-init-test-"));
      // fetch APIをモック
      global.fetch = jest.fn();
    });

    afterEach(async () => {
      // 一時ディレクトリを削除
      await rm(tempDir, { recursive: true, force: true });
      jest.restoreAllMocks();
    });

    it("指定されたURLからテンプレートを正しくダウンロード・展開する（JavaScriptテンプレート）", async () => {
      await mockFetchWithTarball("javascript");

      const source: TemplateSource = {
        tarballUrl:
          "https://api.github.com/repos/kintone/cli-kintone/tarball/main",
        pathInTar: "cli-kintone-main/plugin-templates/javascript",
      };

      await downloadAndExtractFromUrl({
        source,
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

    it("指定されたURLからテンプレートを正しくダウンロード・展開する（TypeScriptテンプレート）", async () => {
      await mockFetchWithTarball("typescript");

      const source: TemplateSource = {
        tarballUrl:
          "https://api.github.com/repos/kintone/cli-kintone/tarball/main",
        pathInTar: "cli-kintone-main/plugin-templates/typescript",
      };

      await downloadAndExtractFromUrl({
        source,
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

      const source: TemplateSource = {
        tarballUrl:
          "https://api.github.com/repos/kintone/cli-kintone/tarball/main",
        pathInTar: "cli-kintone-main/plugin-templates/javascript",
      };

      await assert.rejects(
        async () => {
          await downloadAndExtractFromUrl({
            source,
            outputDir: tempDir,
          });
        },
        {
          message: "Network error",
        },
      );
    });

    it("GITHUB_TOKEN環境変数が設定されている場合、認証ヘッダーを使用する", async () => {
      process.env.GITHUB_TOKEN = "test-token";
      await mockFetchWithTarball("javascript");

      const source: TemplateSource = {
        tarballUrl:
          "https://api.github.com/repos/kintone/cli-kintone/tarball/main",
        pathInTar: "cli-kintone-main/plugin-templates/javascript",
      };

      await downloadAndExtractFromUrl({
        source,
        outputDir: tempDir,
      });

      const calls = (global.fetch as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1];
      const options = lastCall[1] as RequestInit | undefined;
      const headers = options?.headers as Headers | undefined;

      expect(headers?.get("Authorization")).toBe("Bearer test-token");

      delete process.env.GITHUB_TOKEN;
    });
  });
});

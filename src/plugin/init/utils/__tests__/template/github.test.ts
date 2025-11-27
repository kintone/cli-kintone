/* eslint-disable n/no-unsupported-features/node-builtins */
import assert from "assert";
import {
  isGitHubTemplateExists,
  resolveGitHubTemplateSource,
} from "../../template/github";
import {
  mockFetchSuccess,
  mockFetchNotFound,
  mockFetchError,
} from "../helpers/mockFetch";

describe("template/github", () => {
  describe("isGitHubTemplateExists", () => {
    beforeEach(() => {
      // fetch APIをモック
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("存在するテンプレート名でtrueを返す", async () => {
      mockFetchSuccess();

      const result = await isGitHubTemplateExists("javascript");

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

      const result = await isGitHubTemplateExists("non-existent");

      assert.strictEqual(result, false);
    });

    it("GitHub APIエラー時にfalseを返す", async () => {
      mockFetchError();

      const result = await isGitHubTemplateExists("javascript");

      assert.strictEqual(result, false);
    });

    it("GITHUB_TOKEN環境変数が設定されている場合、認証ヘッダーを使用する", async () => {
      process.env.GITHUB_TOKEN = "test-token";
      mockFetchSuccess();

      await isGitHubTemplateExists("javascript");

      const calls = (global.fetch as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1];
      const headers = lastCall[1].headers as Headers;

      expect(headers.get("Authorization")).toBe("Bearer test-token");

      delete process.env.GITHUB_TOKEN;
    });
  });

  describe("resolveGitHubTemplateSource", () => {
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("存在するJavaScriptテンプレート名から正しいTemplateSourceを生成する", async () => {
      mockFetchSuccess();

      const source = await resolveGitHubTemplateSource("javascript");

      assert.strictEqual(
        source.tarballUrl,
        "https://api.github.com/repos/kintone/cli-kintone/tarball/main",
      );
      assert.strictEqual(source.pathInTar, "plugin-templates/javascript");
    });

    it("存在するTypeScriptテンプレート名から正しいTemplateSourceを生成する", async () => {
      mockFetchSuccess();

      const source = await resolveGitHubTemplateSource("typescript");

      assert.strictEqual(
        source.tarballUrl,
        "https://api.github.com/repos/kintone/cli-kintone/tarball/main",
      );
      assert.strictEqual(source.pathInTar, "plugin-templates/typescript");
    });

    it("存在しないテンプレート名でエラーをスローする", async () => {
      mockFetchNotFound();

      await assert.rejects(
        async () => {
          await resolveGitHubTemplateSource("non-existent");
        },
        {
          message: 'GitHub template "non-existent" not found',
        },
      );
    });

    it("GitHub APIエラー時にエラーをスローする", async () => {
      mockFetchError();

      await assert.rejects(
        async () => {
          await resolveGitHubTemplateSource("javascript");
        },
        {
          message: 'GitHub template "javascript" not found',
        },
      );
    });
  });
});

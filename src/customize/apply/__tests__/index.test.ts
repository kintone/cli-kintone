import assert from "assert";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { CustomizeManifest } from "../../core";
import { getBoundMessage } from "../../core";
import { apply, loadManifest } from "../index";

type MockLog = {
  method: string;
  path: string;
  body?: Record<string, unknown>;
};

const createMockApiClient = (): KintoneRestAPIClient & { logs: MockLog[] } => {
  const logs: MockLog[] = [];

  return {
    logs,
    file: {
      uploadFile: async (_params: { file: { path: string } }) => {
        logs.push({ method: "POST", path: "/k/v1/file.json" });
        return { fileKey: "mock-file-key" };
      },
      downloadFile: async (_params: { fileKey: string }) => {
        logs.push({ method: "GET", path: "/k/v1/file.json" });
        return new ArrayBuffer(0);
      },
    },
    app: {
      updateAppCustomize: async (params: unknown) => {
        logs.push({
          method: "PUT",
          path: "/k/v1/preview/app/customize.json",
          body: params as Record<string, unknown>,
        });
        return {};
      },
      deployApp: async (params: { apps: Array<{ app: string }> }) => {
        logs.push({
          method: "POST",
          path: "/k/v1/preview/app/deploy.json",
          body: params as Record<string, unknown>,
        });
        return {};
      },
      getDeployStatus: async (_params: { apps: string[] }) => {
        logs.push({ method: "GET", path: "/k/v1/preview/app/deploy.json" });
        return { apps: [{ app: "1", status: "SUCCESS" as const }] };
      },
      getAppCustomize: async (_params: { app: string }) => {
        logs.push({ method: "GET", path: "/k/v1/app/customize.json" });
        return {
          scope: "ALL",
          desktop: { js: [], css: [] },
          mobile: { js: [], css: [] },
        };
      },
    },
  } as unknown as KintoneRestAPIClient & { logs: MockLog[] };
};

describe("index", () => {
  describe("loadManifest", () => {
    const legacyManifestPath =
      "src/customize/__tests__/fixtures/customize-manifest-legacy.json";

    it("should fill in mobile.css for an old manifest", () => {
      assert.deepStrictEqual(loadManifest(legacyManifestPath).mobile.css, []);
    });

    it("should leave secure option settings absent instead of filling them in", () => {
      // Filling them in with empty arrays would make an apply from a manifest
      // that has neither property clear the settings on the app
      const manifest = loadManifest(legacyManifestPath);
      assert.strictEqual(manifest.permissions, undefined);
      assert.strictEqual(manifest.allowed_hosts, undefined);
    });
  });

  describe("apply", () => {
    let apiClient: ReturnType<typeof createMockApiClient>;
    let manifest: CustomizeManifest;
    const appId = "1";
    const manifestDir = "."; // Paths in manifest are relative to project root
    const boundMessage = getBoundMessage("en");

    beforeEach(() => {
      apiClient = createMockApiClient();
      manifest = {
        scope: "ALL",
        desktop: {
          js: [
            "src/customize/__tests__/fixtures/a.js",
            "src/customize/__tests__/fixtures/b.js",
            "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
          ],
          css: ["src/customize/__tests__/fixtures/a.css"],
        },
        mobile: {
          js: ["src/customize/__tests__/fixtures/c.js"],
          css: ["src/customize/__tests__/fixtures/d.css"],
        },
      };
    });

    const updateRequestBody = () =>
      apiClient.logs.find(
        (log) => log.path === "/k/v1/preview/app/customize.json",
      )?.body;

    it("should succeed the applying", async () => {
      try {
        await apply(apiClient, appId, manifest, manifestDir, boundMessage);
        assert.ok(true, "the apply has been successful");
      } catch (e: unknown) {
        assert.fail(e as Error);
      }
    });

    it("should call kintone APIs by the right order", async () => {
      await apply(apiClient, appId, manifest, manifestDir, boundMessage);
      assert.deepStrictEqual(
        apiClient.logs.map(({ method, path }) => ({ method, path })),
        [
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "POST", path: "/k/v1/file.json" },
          { method: "PUT", path: "/k/v1/preview/app/customize.json" },
          { method: "POST", path: "/k/v1/preview/app/deploy.json" },
          { method: "GET", path: "/k/v1/preview/app/deploy.json" },
        ],
      );
    });

    it("should not send secure option settings when the manifest has none", async () => {
      await apply(apiClient, appId, manifest, manifestDir, boundMessage);

      const body = updateRequestBody();
      assert.ok(body !== undefined);
      assert.ok(!("permissions" in body));
      assert.ok(!("allowedHosts" in body));
    });

    it("should send secure option settings when the manifest has them", async () => {
      manifest.permissions = [{ permission: "kintone:app_record:read" }];
      manifest.allowed_hosts = ["https://www.example.com"];

      await apply(apiClient, appId, manifest, manifestDir, boundMessage);

      const body = updateRequestBody();
      assert.deepStrictEqual(body?.permissions, [
        { permission: "kintone:app_record:read" },
      ]);
      assert.deepStrictEqual(body?.allowedHosts, ["https://www.example.com"]);
    });

    it("should send only the property that the manifest has", async () => {
      manifest.permissions = [{ permission: "kintone:app_record:read" }];

      await apply(apiClient, appId, manifest, manifestDir, boundMessage);

      const body = updateRequestBody();
      assert.ok(body !== undefined);
      assert.deepStrictEqual(body.permissions, [
        { permission: "kintone:app_record:read" },
      ]);
      assert.ok(!("allowedHosts" in body));
    });

    it("should send empty arrays to clear secure option settings", async () => {
      manifest.permissions = [];
      manifest.allowed_hosts = [];

      await apply(apiClient, appId, manifest, manifestDir, boundMessage);

      const body = updateRequestBody();
      assert.deepStrictEqual(body?.permissions, []);
      assert.deepStrictEqual(body?.allowedHosts, []);
    });
  });
});

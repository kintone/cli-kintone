import assert from "assert";
import * as fs from "fs";
import { rimrafSync } from "rimraf";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getBoundMessage } from "../../core";
import { exportCustomizeSetting } from "../index";

type MockLog = {
  method: string;
  path: string;
  body?: Record<string, unknown>;
};

const createMockApiClient = (
  getAppCustomizeResponse: unknown,
  downloadFileResponse: ArrayBuffer,
): KintoneRestAPIClient & { logs: MockLog[] } => {
  const logs: MockLog[] = [];

  return {
    logs,
    file: {
      uploadFile: async (_params: { file: { path: string } }) => {
        logs.push({ method: "POST", path: "/k/v1/file.json" });
        return { fileKey: "mock-file-key" };
      },
      downloadFile: async (params: { fileKey: string }) => {
        logs.push({
          method: "GET",
          path: "/k/v1/file.json",
          body: { fileKey: params.fileKey },
        });
        return downloadFileResponse;
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
      getAppCustomize: async (params: { app: string }) => {
        logs.push({
          method: "GET",
          path: "/k/v1/app/customize.json",
          body: { app: params.app },
        });
        return getAppCustomizeResponse;
      },
    },
  } as unknown as KintoneRestAPIClient & { logs: MockLog[] };
};

describe("export", () => {
  const testDestDir = "testDestDir";
  const testOutputPath = `${testDestDir}/customize-manifest.json`;
  const filesToTestContent = [
    `${testDestDir}/desktop/js/bootstrap.min.js`,
    `${testDestDir}/desktop/js/a.js`,
    `${testDestDir}/desktop/css/bootstrap.min.css`,
    `${testDestDir}/desktop/css/bootstrap-reboot.min.css`,
    `${testDestDir}/desktop/css/bootstrap-grid.min.css`,
    `${testDestDir}/mobile/js/bootstrap.js`,
    `${testDestDir}/mobile/js/b.js`,
  ];

  const uploadFileBody = `(function() { console.log("hello"); })();`;

  describe("runExport", () => {
    let apiClient: ReturnType<typeof createMockApiClient>;
    const appId = "1";
    const m = getBoundMessage("en");

    beforeEach(() => {
      const getAppCustomizeResponse = JSON.parse(
        fs
          .readFileSync(
            "src/customize/__tests__/fixtures/get-appcustomize-response.json",
          )
          .toString(),
      );
      const downloadFileResponse = new TextEncoder().encode(uploadFileBody)
        .buffer as ArrayBuffer;
      apiClient = createMockApiClient(
        getAppCustomizeResponse,
        downloadFileResponse,
      );
    });

    afterEach(() => {
      rimrafSync(`${testDestDir}`);
    });

    const assertManifestContent = (buffer: Buffer) => {
      // Manifest should contain paths relative to manifest file location
      const appCustomize = {
        scope: "ALL",
        desktop: {
          js: [
            "https://js.cybozu.com/vuejs/v2.5.17/vue.min.js",
            "https://js.cybozu.com/lodash/4.17.11/lodash.min.js",
            "desktop/js/bootstrap.min.js",
            "desktop/js/a.js",
          ],
          css: [
            "desktop/css/bootstrap.min.css",
            "desktop/css/bootstrap-reboot.min.css",
            "desktop/css/bootstrap-grid.min.css",
          ],
        },
        mobile: {
          js: [
            "https://js.cybozu.com/jquery/3.3.1/jquery.min.js",
            "https://js.cybozu.com/jqueryui/1.12.1/jquery-ui.min.js",
            "mobile/js/bootstrap.js",
            "mobile/js/b.js",
          ],
          css: [
            "mobile/css/bootstrap.min.css",
            "mobile/css/bootstrap-reboot.min.css",
            "mobile/css/bootstrap-grid.min.css",
          ],
        },
      };
      assert.deepStrictEqual(JSON.parse(buffer.toString()), appCustomize);
    };

    const assertDownloadFile = (path: string) => {
      assert.ok(fs.existsSync(path), `test ${path} is exists`);
      const content = fs.readFileSync(path);
      assert.strictEqual(uploadFileBody, content.toString());
    };

    const assertExportUseCaseApiRequest = (
      mockApiClient: ReturnType<typeof createMockApiClient>,
    ) => {
      // First request should be getAppCustomize
      assert.deepStrictEqual(mockApiClient.logs[0], {
        body: { app: "1" },
        method: "GET",
        path: "/k/v1/app/customize.json",
      });

      // File download requests (order may vary due to parallel execution)
      const expectedFileKeys = [
        "20181116095653774F24C632AF46E69BDC8F5EF04C8E24014",
        "20181116095653FF8D40EE4B364FD89A2B3A382EDCB259286",
        "201811160956531AFF9246D7CB40938A91EAC14A0622C9250",
        "201811160956531DCC5DA8C6E0480C8F3BD8A92EEFF584123",
        "20181116095653A6A52415705D403A9B1AB36E1448B32E191",
        "20181116095653C06A1FE34CFD43D6B21BE7F55D3B6ECB031",
        "201811160956535E4F00740689488C9ABE7DCF3E794B34315",
        "201811160956531AFF9246D7CB40938A91EAC14A0622C9250",
        "201811160956531DCC5DA8C6E0480C8F3BD8A92EEFF584123",
        "20181116095653A6A52415705D403A9B1AB36E1448B32E191",
      ];

      const actualFileKeys = mockApiClient.logs
        .slice(1)
        .map((log) => (log.body as { fileKey: string }).fileKey)
        .sort();
      const sortedExpectedFileKeys = [...expectedFileKeys].sort();

      assert.deepStrictEqual(actualFileKeys, sortedExpectedFileKeys);
    };

    it("should success updating customize-manifest.json and downloading uploaded js/css files", async () => {
      await exportCustomizeSetting(apiClient, appId, testOutputPath, m);

      assertExportUseCaseApiRequest(apiClient);
      const manifestFile = `${testDestDir}/customize-manifest.json`;
      assert.ok(fs.existsSync(manifestFile), `test ${manifestFile} exists`);
      const contents = fs.readFileSync(manifestFile);
      assertManifestContent(contents);
      filesToTestContent.map(assertDownloadFile);
    });
  });
});

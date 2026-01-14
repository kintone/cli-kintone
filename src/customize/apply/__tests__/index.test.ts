import assert from "assert";
import type { CustomizeManifest, Option } from "../../core";
import type { Status } from "../index";
import { apply } from "../index";
import MockKintoneApiClient from "../../core/__tests__/MockKintoneApiClient";

describe("index", () => {
  describe("apply", () => {
    let kintoneApiClient: MockKintoneApiClient;
    let manifest: CustomizeManifest;
    let status: Status;
    let options: Option;
    const appId = "1";
    beforeEach(() => {
      kintoneApiClient = new MockKintoneApiClient(
        "kintone",
        "hogehoge",
        "oAuthToken",
        "basicAuthUser",
        "basicAuthPass",
        "https://example.com",
        {
          proxy: "",
          guestSpaceId: 0,
        },
      );
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
      status = {
        retryCount: 0,
        updateBody: null,
        updated: false,
      };
      options = {
        lang: "en",
        proxy: "",
        guestSpaceId: 0,
      };
    });
    it("should succeed the applying", async () => {
      try {
        await apply(kintoneApiClient, appId, manifest, status, options);
        assert.ok(true, "the apply has been successful");
      } catch (e: any) {
        assert.fail(e);
      }
    });
    it("should call kintone APIs by the right order", async () => {
      await apply(kintoneApiClient, appId, manifest, status, options);
      assert.deepStrictEqual(
        kintoneApiClient.logs.map(({ method, path }) => ({
          method,
          path,
        })),
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
  });
});

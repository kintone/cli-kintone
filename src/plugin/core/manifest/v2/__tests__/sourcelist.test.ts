import { sourceListV2 } from "../sourcelist";
import type { ManifestV2JsonObject } from "../index";

describe("sourceListV2", () => {
  let manifest: ManifestV2JsonObject;
  beforeEach(() => {
    manifest = {
      $schema: "https://example.com/plugin-manifest-schema.json",
      manifest_version: 2,
      version: 1,
      type: "APP",
      name: {
        ja: "My拡張",
        en: "My Extension",
        zh: "My Extension",
      },
      description: {
        ja: "My拡張です。",
        en: "This is My Extension.",
        zh: "This is My Extension.",
      },
      icon: "image/icon.png",
      homepage_url: {
        ja: "http://cybozu.co.jp",
        en: "http://kintone.com",
        zh: "http://cybozu.cn",
      },
      components: [
        {
          type: "APP_INDEX_HEADER_SPACE",
          js: ["js/customize.js", "https://example.com/js/customize.js"],
          css: ["https://example.com/css/customize.css", "css/customize.css"],
          html: "html/customize.html",
        },
      ],
      config: {
        html: "html/config.html",
        js: [
          "https://example.com/js/config.js",
          "js/config.js",
          "js/config.js", // Duplicated entry
        ],
        css: ["css/config.css", "https://example.com/css/config.css"],
        required_params: ["Param1", "Param2"],
      },
      allowed_hosts: ["https://example.com"],
      permissions: {
        js_api: [
          "rest_api:execute",
          "kintone.app.getId",
          "kintone.plugin.app.getConfig",
        ],
        rest_api: ["app_record:read", "/k/v1/record.json:put"],
      },
    };
  });
  it("should return distinct local files from the manifest", () => {
    expect(sourceListV2(manifest)).toStrictEqual([
      "manifest.json",
      "image/icon.png",
      "js/customize.js",
      "css/customize.css",
      "html/customize.html",
      "html/config.html",
      "js/config.js",
      "css/config.css",
    ]);
  });
});

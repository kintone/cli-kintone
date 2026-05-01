import { describe, expect, it } from "vitest";
import type { ManifestInterface } from "../../core/manifest/interface";
import { buildJsonInfo } from "../index";

const baseManifest: ManifestInterface = {
  validate: async () => ({ valid: true, warnings: [] }),
  sourceList: () => [],
  generateContentsZip: async () => ({}) as never,
  manifestVersion: 1,
  name: "Sample Plugin",
  version: 1,
  description: "A plugin for unit test",
  homepageUrl: "https://example.com",
  sandbox: undefined,
  allowedHosts: undefined,
  permissions: undefined,
  json: {},
};

describe("buildJsonInfo", () => {
  it("returns identity / description / homepage from the manifest", () => {
    const info = buildJsonInfo("plugin-id", baseManifest);
    expect(info).toEqual({
      id: "plugin-id",
      name: "Sample Plugin",
      version: 1,
      description: "A plugin for unit test",
      homepage: "https://example.com",
      sandbox: undefined,
      allowed_hosts: undefined,
      permissions: undefined,
    });
  });

  it("emits sandbox-related keys with snake_case names", () => {
    const info = buildJsonInfo("plugin-id", {
      ...baseManifest,
      sandbox: true,
      allowedHosts: ["https://example.com"],
      permissions: {
        js_api: ["app:read"],
        rest_api: ["app_record:read"],
      },
    });
    expect(info.sandbox).toBe(true);
    expect(info.allowed_hosts).toEqual(["https://example.com"]);
    expect(info.permissions).toEqual({
      js_api: ["app:read"],
      rest_api: ["app_record:read"],
    });
  });

  it("drops absent sandbox keys when serialized as JSON (undefined → omitted)", () => {
    const info = buildJsonInfo("plugin-id", baseManifest);
    const serialized = JSON.parse(JSON.stringify(info));
    expect(serialized).not.toHaveProperty("sandbox");
    expect(serialized).not.toHaveProperty("allowed_hosts");
    expect(serialized).not.toHaveProperty("permissions");
    expect(serialized).toMatchObject({
      id: "plugin-id",
      name: "Sample Plugin",
      version: 1,
    });
  });

  it("preserves sandbox: false (not stripped) when serialized", () => {
    const info = buildJsonInfo("plugin-id", {
      ...baseManifest,
      sandbox: false,
    });
    const serialized = JSON.parse(JSON.stringify(info));
    expect(serialized.sandbox).toBe(false);
  });
});

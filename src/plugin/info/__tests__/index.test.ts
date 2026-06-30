import { describe, expect, it } from "vitest";
import type { ManifestInterface } from "../../core/manifest/interface";
import { buildPluginInfoJson } from "../index";

const baseManifest: ManifestInterface = {
  manifestFileName: "manifest.json",
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

describe("buildPluginInfoJson", () => {
  it("returns identity / description / homepage from the manifest", () => {
    const info = buildPluginInfoJson("plugin-id", baseManifest);
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
    const info = buildPluginInfoJson("plugin-id", {
      ...baseManifest,
      sandbox: true,
      allowedHosts: ["https://example.com"],
      permissions: [
        { permission: "app:read" },
        { permission: "app_record:read", scope: "self" },
      ],
    });
    expect(info.sandbox).toBe(true);
    expect(info.allowed_hosts).toEqual(["https://example.com"]);
    expect(info.permissions).toEqual([
      { permission: "app:read" },
      { permission: "app_record:read", scope: "self" },
    ]);
  });

  it("drops absent sandbox keys when serialized as JSON (undefined → omitted)", () => {
    const info = buildPluginInfoJson("plugin-id", baseManifest);
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
    const info = buildPluginInfoJson("plugin-id", {
      ...baseManifest,
      sandbox: false,
    });
    const serialized = JSON.parse(JSON.stringify(info));
    expect(serialized.sandbox).toBe(false);
  });
});

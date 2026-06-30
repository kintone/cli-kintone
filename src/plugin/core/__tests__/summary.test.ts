import { describe, expect, it } from "vitest";
import type { ManifestInterface } from "../manifest/interface";
import { buildPluginSummary } from "../summary";

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

const withSandboxFields = (
  fields: Partial<
    Pick<ManifestInterface, "sandbox" | "allowedHosts" | "permissions">
  >,
): ManifestInterface => ({
  ...baseManifest,
  ...fields,
});

describe("buildPluginSummary", () => {
  it("returns identity / description / homepage from manifest", () => {
    const summary = buildPluginSummary("plugin-id", baseManifest);
    expect(summary.id).toBe("plugin-id");
    expect(summary.name).toBe("Sample Plugin");
    expect(summary.version).toBe("1");
    expect(summary.description).toBe("A plugin for unit test");
    expect(summary.homepage).toBe("https://example.com");
  });

  it("uses (not set) for missing description / homepage", () => {
    const empty = buildPluginSummary("plugin-id", {
      ...baseManifest,
      description: undefined,
      homepageUrl: undefined,
    });
    expect(empty.description).toBe("(not set)");
    expect(empty.homepage).toBe("(not set)");
  });

  describe("sandbox block", () => {
    it("returns null when no sandbox fields are defined", () => {
      const summary = buildPluginSummary("plugin-id", baseManifest);
      expect(summary.sandbox).toBeNull();
    });

    it("formats every field when all are defined", () => {
      const summary = buildPluginSummary(
        "plugin-id",
        withSandboxFields({
          sandbox: true,
          allowedHosts: ["https://example.com", "wss://example.com/ws/*"],
          permissions: [
            { permission: "app:read" },
            { permission: "network:connect" },
            { permission: "app_record:read", scope: "self" },
          ],
        }),
      );
      expect(summary.sandbox).toEqual({
        sandbox: "true",
        allowedHosts: "https://example.com, wss://example.com/ws/*",
        permissions: "app:read, network:connect, app_record:read:self",
      });
    });

    it("uses (not set) for fields that are undefined when at least one sibling is defined", () => {
      const summary = buildPluginSummary(
        "plugin-id",
        withSandboxFields({
          sandbox: true,
          allowedHosts: undefined,
          permissions: undefined,
        }),
      );
      expect(summary.sandbox).toEqual({
        sandbox: "true",
        allowedHosts: "(not set)",
        permissions: "(not set)",
      });
    });

    it("uses (none) for explicitly empty arrays and (not set) for omitted fields", () => {
      const summary = buildPluginSummary(
        "plugin-id",
        withSandboxFields({
          sandbox: true,
          allowedHosts: [],
          permissions: [],
        }),
      );
      expect(summary.sandbox).toEqual({
        sandbox: "true",
        allowedHosts: "(none)",
        permissions: "(none)",
      });
    });

    it("returns sandbox: (not set) when only siblings are defined", () => {
      const summary = buildPluginSummary(
        "plugin-id",
        withSandboxFields({
          sandbox: undefined,
          allowedHosts: ["https://example.com"],
          permissions: undefined,
        }),
      );
      expect(summary.sandbox).toEqual({
        sandbox: "(not set)",
        allowedHosts: "https://example.com",
        permissions: "(not set)",
      });
    });

    it("formats sandbox: false correctly (not as not set)", () => {
      const summary = buildPluginSummary(
        "plugin-id",
        withSandboxFields({
          sandbox: false,
          allowedHosts: undefined,
          permissions: undefined,
        }),
      );
      expect(summary.sandbox?.sandbox).toBe("false");
    });
  });
});

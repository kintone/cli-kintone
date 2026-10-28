import type { ManifestInterface } from "../../../../core/manifest/interface";
import type { LocalPluginRepository } from "../../../usecases/interface";
import { LocalPluginRepositoryMock } from "../../../repositories/localPluginRepositoryMock";
import { buildPluginInfoJson, info } from "../../info";

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

const sandboxManifest: ManifestInterface = {
  ...baseManifest,
  sandbox: true,
  allowedHosts: ["https://example.com", "*"],
  permissions: [
    { permission: "app:read" },
    { permission: "app_record:read", scope: "self" },
  ],
};

describe("info", () => {
  it("should return the plain output without sandbox", async () => {
    const repositoryMock = new LocalPluginRepositoryMock({
      id: "plugin-id",
      manifest: baseManifest,
    });

    await expect(info(repositoryMock, "plain")).resolves.toBe(
      [
        "id: plugin-id",
        "name: Sample Plugin",
        "version: 1",
        "description: A plugin for unit test",
        "homepage: https://example.com",
      ].join("\n"),
    );
  });

  it("should return the plain output with sandbox", async () => {
    const repositoryMock = new LocalPluginRepositoryMock({
      id: "plugin-id",
      manifest: sandboxManifest,
    });

    await expect(info(repositoryMock, "plain")).resolves.toBe(
      [
        "id: plugin-id",
        "name: Sample Plugin",
        "version: 1",
        "description: A plugin for unit test",
        "homepage: https://example.com",
        "sandbox: true",
        "allowed_hosts: https://example.com, *",
        "permissions: app:read, app_record:read:self",
      ].join("\n"),
    );
  });

  it("should print (not set) for the absent description and homepage in plain", async () => {
    const repositoryMock = new LocalPluginRepositoryMock({
      id: "plugin-id",
      manifest: {
        ...baseManifest,
        description: undefined,
        homepageUrl: undefined,
      },
    });

    const output = await info(repositoryMock, "plain");

    expect(output.split("\n")).toEqual(
      expect.arrayContaining(["description: (not set)", "homepage: (not set)"]),
    );
  });

  it("should keep format specifiers in values as they are in plain", async () => {
    const repositoryMock = new LocalPluginRepositoryMock({
      id: "plugin-id",
      manifest: { ...baseManifest, description: "100%s %d %%" },
    });

    const output = await info(repositoryMock, "plain");

    expect(output.split("\n")).toContain("description: 100%s %d %%");
  });

  it("should return the json output without sandbox", async () => {
    const repositoryMock = new LocalPluginRepositoryMock({
      id: "plugin-id",
      manifest: baseManifest,
    });

    await expect(info(repositoryMock, "json")).resolves.toBe(
      JSON.stringify(buildPluginInfoJson("plugin-id", baseManifest), null, 2),
    );
  });

  it("should return the json output with sandbox", async () => {
    const repositoryMock = new LocalPluginRepositoryMock({
      id: "plugin-id",
      manifest: sandboxManifest,
    });

    const output = await info(repositoryMock, "json");

    expect(JSON.parse(output)).toEqual({
      id: "plugin-id",
      name: "Sample Plugin",
      version: 1,
      description: "A plugin for unit test",
      homepage: "https://example.com",
      sandbox: true,
      allowed_hosts: ["https://example.com", "*"],
      permissions: [
        { permission: "app:read" },
        { permission: "app_record:read", scope: "self" },
      ],
    });
  });

  it("should pass the error of the repository through as it is", async () => {
    const error = new Error("failed to read the plugin");
    const failingRepository: LocalPluginRepository = {
      read: async () => {
        throw error;
      },
    };

    await expect(info(failingRepository, "plain")).rejects.toBe(error);
  });
});

describe("buildPluginInfoJson", () => {
  it("returns identity / description / homepage from the manifest", () => {
    const infoJson = buildPluginInfoJson("plugin-id", baseManifest);
    expect(infoJson).toEqual({
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
    const infoJson = buildPluginInfoJson("plugin-id", {
      ...baseManifest,
      sandbox: true,
      allowedHosts: ["https://example.com"],
      permissions: [
        { permission: "app:read" },
        { permission: "app_record:read", scope: "self" },
      ],
    });
    expect(infoJson.sandbox).toBe(true);
    expect(infoJson.allowed_hosts).toEqual(["https://example.com"]);
    expect(infoJson.permissions).toEqual([
      { permission: "app:read" },
      { permission: "app_record:read", scope: "self" },
    ]);
  });

  it("drops absent sandbox keys when serialized as JSON (undefined → omitted)", () => {
    const infoJson = buildPluginInfoJson("plugin-id", baseManifest);
    const serialized = JSON.parse(JSON.stringify(infoJson));
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
    const infoJson = buildPluginInfoJson("plugin-id", {
      ...baseManifest,
      sandbox: false,
    });
    const serialized = JSON.parse(JSON.stringify(infoJson));
    expect(serialized.sandbox).toBe(false);
  });
});

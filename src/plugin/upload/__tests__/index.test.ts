import { vi, type MockedClass } from "vitest";
import path from "path";
import { upload, buildSandboxSummary } from "../index";

const fixturesDir = path.join(__dirname, "fixtures");

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type * as KintoneRestAPIClientModule from "@kintone/rest-api-client";

vi.mock("@kintone/rest-api-client");
const KintoneRestAPIClientMock = KintoneRestAPIClient as MockedClass<
  typeof KintoneRestAPIClient
>;

// Helper to create an actual API client instance for mocking
const createApiClientMock = async (baseUrl: string) => {
  const mod = await vi.importActual<typeof KintoneRestAPIClientModule>(
    "@kintone/rest-api-client",
  );
  return new mod.KintoneRestAPIClient({
    baseUrl,
    auth: { username: "user", password: "pass" },
  });
};

describe("plugin upload command", () => {
  it("should call installPlugin API when the plugin have not been installed on kintone", async () => {
    const pluginId = "pebpcljifhnnddaohkbfehcjmaadchja";
    const pluginFilePath = path.join(fixturesDir, `${pluginId}.zip`);
    const dummyFileKey = "dummyFileKey";

    const apiClientMock = await createApiClientMock(
      "https://example.kintone.com",
    );
    KintoneRestAPIClientMock.mockImplementationOnce(() => apiClientMock);

    apiClientMock.file.uploadFile = vi
      .fn()
      .mockResolvedValue({ fileKey: dummyFileKey });

    apiClientMock.plugin.getPlugins = vi.fn().mockResolvedValue({
      plugins: [], // No installed
    });
    apiClientMock.plugin.installPlugin = vi.fn();
    apiClientMock.plugin.updatePlugin = vi.fn();

    await upload({
      pluginFilePath: pluginFilePath,
      force: true,
      watch: false,
      baseUrl: "https://example.kintone.com",
      username: "user",
      password: "pass",
    });

    expect(apiClientMock.file.uploadFile).toHaveBeenCalled();
    expect(apiClientMock.plugin.getPlugins).toHaveBeenCalledWith({
      ids: [pluginId],
    });
    expect(apiClientMock.plugin.installPlugin).toHaveBeenCalledWith({
      fileKey: dummyFileKey,
    });
    expect(apiClientMock.plugin.updatePlugin).not.toHaveBeenCalled();
  });

  it("should call updatePlugin API when the plugin have been installed on kintone", async () => {
    const pluginId = "pebpcljifhnnddaohkbfehcjmaadchja";
    const pluginFilePath = path.join(fixturesDir, `${pluginId}.zip`);
    const dummyFileKey = "dummyFileKey";

    const apiClientMock = await createApiClientMock(
      "https://example.kintone.com",
    );
    KintoneRestAPIClientMock.mockImplementationOnce(() => apiClientMock);

    apiClientMock.file.uploadFile = vi
      .fn()
      .mockResolvedValue({ fileKey: dummyFileKey });

    apiClientMock.plugin.getPlugins = vi.fn().mockResolvedValue({
      plugins: [
        // Already installed
        {
          id: pluginId,
          name: "Sample Plugin",
          version: "0.1.0",
          isMarketPlugin: false,
        },
      ],
    });
    apiClientMock.plugin.installPlugin = vi.fn();
    apiClientMock.plugin.updatePlugin = vi.fn();

    await upload({
      pluginFilePath: pluginFilePath,
      force: true,
      watch: false,
      baseUrl: "https://example.kintone.com",
      username: "user",
      password: "pass",
    });

    expect(apiClientMock.file.uploadFile).toHaveBeenCalled();
    expect(apiClientMock.plugin.getPlugins).toHaveBeenCalledWith({
      ids: [pluginId],
    });
    expect(apiClientMock.plugin.installPlugin).not.toHaveBeenCalled();
    expect(apiClientMock.plugin.updatePlugin).toHaveBeenCalledWith({
      id: pluginId,
      fileKey: dummyFileKey,
    });
  });
});

describe("buildSandboxSummary", () => {
  it("returns empty string when no sandbox fields are defined", () => {
    expect(
      buildSandboxSummary({
        sandbox: undefined,
        allowedHosts: undefined,
        permissions: undefined,
      }),
    ).toBe("");
  });

  it("prints all four lines when every field is defined", () => {
    expect(
      buildSandboxSummary({
        sandbox: true,
        allowedHosts: ["https://example.com", "wss://example.com/ws/*"],
        permissions: {
          js_api: ["app:read", "network:connect"],
          rest_api: ["app_record:read"],
        },
      }),
    ).toBe(
      [
        "",
        "    Sandbox: true",
        "    Allowed hosts: https://example.com, wss://example.com/ws/*",
        "    Permissions (js_api): app:read, network:connect",
        "    Permissions (rest_api): app_record:read",
      ].join("\n"),
    );
  });

  it("uses (not set) for fields that are undefined when at least one sibling is defined", () => {
    expect(
      buildSandboxSummary({
        sandbox: true,
        allowedHosts: undefined,
        permissions: undefined,
      }),
    ).toBe(
      [
        "",
        "    Sandbox: true",
        "    Allowed hosts: (not set)",
        "    Permissions (js_api): (not set)",
        "    Permissions (rest_api): (not set)",
      ].join("\n"),
    );
  });

  it("uses (none) when the parent is declared but entries are empty or missing", () => {
    expect(
      buildSandboxSummary({
        sandbox: true,
        allowedHosts: [],
        permissions: { js_api: [] },
      }),
    ).toBe(
      [
        "",
        "    Sandbox: true",
        "    Allowed hosts: (none)",
        "    Permissions (js_api): (none)",
        "    Permissions (rest_api): (none)",
      ].join("\n"),
    );
  });

  it("prints sandbox: (not set) when only non-sandbox siblings are defined", () => {
    expect(
      buildSandboxSummary({
        sandbox: undefined,
        allowedHosts: ["https://example.com"],
        permissions: undefined,
      }),
    ).toBe(
      [
        "",
        "    Sandbox: (not set)",
        "    Allowed hosts: https://example.com",
        "    Permissions (js_api): (not set)",
        "    Permissions (rest_api): (not set)",
      ].join("\n"),
    );
  });
});

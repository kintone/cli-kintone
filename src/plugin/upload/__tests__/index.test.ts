import { vi, type MockedClass } from "vitest";
import path from "path";
import { upload } from "../index";

const fixturesDir = path.join(__dirname, "fixtures");

import { KintoneRestAPIClient } from "@kintone/rest-api-client";

vi.mock("@kintone/rest-api-client");
const KintoneRestAPIClientMock = KintoneRestAPIClient as MockedClass<
  typeof KintoneRestAPIClient
>;

// Helper to create an actual API client instance for mocking
const createApiClientMock = async (baseUrl: string) => {
  const mod = await vi.importActual<typeof import("@kintone/rest-api-client")>(
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

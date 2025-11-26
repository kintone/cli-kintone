import path from "path";
import { upload } from "../index";

const fixturesDir = path.join(__dirname, "fixtures");

import { KintoneRestAPIClient } from "@kintone/rest-api-client";

jest.mock("@kintone/rest-api-client");
const KintoneRestAPIClientMock = KintoneRestAPIClient as jest.MockedClass<
  typeof KintoneRestAPIClient
>;
const OriginalKintoneRestAPIClient: typeof KintoneRestAPIClient =
  jest.requireActual("@kintone/rest-api-client").KintoneRestAPIClient;

describe("plugin upload command", () => {
  it("should call installPlugin API when the plugin have not been installed on kintone", async () => {
    const pluginId = "pebpcljifhnnddaohkbfehcjmaadchja";
    const pluginFilePath = path.join(fixturesDir, `${pluginId}.zip`);
    const dummyFileKey = "dummyFileKey";

    const apiClientMock = new OriginalKintoneRestAPIClient({
      baseUrl: "https://example.kintone.com",
      auth: {
        username: "user",
        password: "pass",
      },
    });
    KintoneRestAPIClientMock.mockImplementationOnce((_) => apiClientMock);

    apiClientMock.file.uploadFile = jest
      .fn()
      .mockResolvedValue({ fileKey: dummyFileKey });

    apiClientMock.plugin.getPlugins = jest.fn().mockResolvedValue({
      plugins: [], // No installed
    });
    apiClientMock.plugin.installPlugin = jest.fn();
    apiClientMock.plugin.updatePlugin = jest.fn();

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

    const apiClientMock = new OriginalKintoneRestAPIClient({
      baseUrl: "https://example.kintone.com",
      auth: {
        username: "user",
        password: "pass",
      },
    });
    KintoneRestAPIClientMock.mockImplementationOnce((_) => apiClientMock);

    apiClientMock.file.uploadFile = jest
      .fn()
      .mockResolvedValue({ fileKey: dummyFileKey });

    apiClientMock.plugin.getPlugins = jest.fn().mockResolvedValue({
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
    apiClientMock.plugin.installPlugin = jest.fn();
    apiClientMock.plugin.updatePlugin = jest.fn();

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

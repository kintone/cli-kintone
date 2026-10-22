import { vi } from "vitest";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { ManifestInterface } from "../../../../core/manifest/interface";
import { logger } from "../../../../../utils/log";
import { LocalPluginRepositoryMock } from "../../../repositories/localPluginRepositoryMock";
import type { LocalPlugin } from "../../interface";
import { upload } from "../../upload";

const pluginId = "pebpcljifhnnddaohkbfehcjmaadchja";
const fileKey = "dummy-file-key";

const baseManifest: ManifestInterface = {
  manifestFileName: "manifest.json",
  validate: async () => ({ valid: true, warnings: [] }),
  sourceList: () => [],
  generateContentsZip: async () => ({}) as never,
  manifestVersion: 1,
  name: "Sample Plugin",
  version: "1.0.0",
  description: undefined,
  homepageUrl: undefined,
  sandbox: undefined,
  allowedHosts: undefined,
  permissions: undefined,
  json: {},
};

const basePlugin: LocalPlugin = {
  filePath: "/path/to/plugin.zip",
  id: pluginId,
  manifest: baseManifest,
  buffer: Buffer.from("plugin zip"),
};

const options = {
  baseUrl: "https://example.kintone.com",
  yes: true,
  watch: false,
};

const summaryOf = (lines: string[]) =>
  `\n  Installation Summary:\n${lines.join("\n")}`;

describe("upload", () => {
  let apiClient: KintoneRestAPIClient;
  let confirm: ReturnType<typeof vi.fn<(message: string) => Promise<boolean>>>;

  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
    apiClient.plugin.getPlugins = vi.fn().mockResolvedValue({ plugins: [] });
    apiClient.file.uploadFile = vi.fn().mockResolvedValue({ fileKey });
    apiClient.plugin.installPlugin = vi.fn().mockResolvedValue({});
    apiClient.plugin.updatePlugin = vi.fn().mockResolvedValue({});
    confirm = vi.fn<(message: string) => Promise<boolean>>();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const installedAs = (version: string) => {
    apiClient.plugin.getPlugins = vi.fn().mockResolvedValue({
      plugins: [
        { id: pluginId, name: "Sample Plugin", isMarketPlugin: false, version },
      ],
    });
  };

  it("should install the plugin when it is not installed", async () => {
    const infoSpy = vi.spyOn(logger, "info");

    await upload(
      apiClient,
      new LocalPluginRepositoryMock(basePlugin),
      options,
      confirm,
    );

    expect(apiClient.plugin.getPlugins).toHaveBeenCalledWith({
      ids: [pluginId],
    });
    expect(apiClient.file.uploadFile).toHaveBeenCalledWith({
      file: { name: "/path/to/plugin.zip", data: Buffer.from("plugin zip") },
    });
    expect(apiClient.plugin.installPlugin).toHaveBeenCalledWith({ fileKey });
    expect(apiClient.plugin.updatePlugin).not.toHaveBeenCalled();
    expect(infoSpy.mock.calls).toStrictEqual([
      [
        summaryOf([
          "    Destination: https://example.kintone.com",
          "    File Path: /path/to/plugin.zip",
          `    Plugin ID: ${pluginId}`,
          "    Plugin Name: Sample Plugin",
          "    Current version: (not installed)",
          "    Target version: 1.0.0",
        ]),
      ],
      ["Plugin is installed successfully."],
    ]);
  });

  it("should update the plugin when it is installed", async () => {
    installedAs("0.9.0");
    const infoSpy = vi.spyOn(logger, "info");

    await upload(
      apiClient,
      new LocalPluginRepositoryMock(basePlugin),
      options,
      confirm,
    );

    expect(apiClient.plugin.updatePlugin).toHaveBeenCalledWith({
      id: pluginId,
      fileKey,
    });
    expect(apiClient.plugin.installPlugin).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "    Current version: 0.9.0\n    Target version: 1.0.0",
      ),
    );
  });

  it("should mark the summary as reinstall when the same version is installed", async () => {
    installedAs("1.0.0");
    const infoSpy = vi.spyOn(logger, "info");

    await upload(
      apiClient,
      new LocalPluginRepositoryMock(basePlugin),
      options,
      confirm,
    );

    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "    Current version: 1.0.0\n    Target version: 1.0.0 (reinstall)",
      ),
    );
  });

  it("should show the sandbox settings in the summary", async () => {
    const infoSpy = vi.spyOn(logger, "info");

    await upload(
      apiClient,
      new LocalPluginRepositoryMock({
        ...basePlugin,
        manifest: {
          ...baseManifest,
          sandbox: true,
          allowedHosts: ["https://example.com"],
          permissions: [{ permission: "app:read" }],
        },
      }),
      options,
      confirm,
    );

    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        [
          "    Target version: 1.0.0",
          "    Sandbox: true",
          "    Allowed hosts: https://example.com",
          "    Permissions: app:read",
        ].join("\n"),
      ),
    );
  });

  it.each([
    { yes: false, watch: false, asked: true },
    { yes: true, watch: false, asked: false },
    { yes: false, watch: true, asked: false },
    { yes: true, watch: true, asked: false },
  ])(
    "should ask for confirmation only when neither yes nor watch is given (yes: $yes, watch: $watch)",
    async ({ yes, watch, asked }) => {
      confirm.mockResolvedValue(true);

      await upload(
        apiClient,
        new LocalPluginRepositoryMock(basePlugin),
        { ...options, yes, watch },
        confirm,
      );

      if (asked) {
        expect(confirm).toHaveBeenCalledWith("Do you want to continue?");
      } else {
        expect(confirm).not.toHaveBeenCalled();
      }
      expect(apiClient.plugin.installPlugin).toHaveBeenCalled();
    },
  );

  it("should not upload the plugin when the user cancels", async () => {
    confirm.mockResolvedValue(false);
    const infoSpy = vi.spyOn(logger, "info");

    await upload(
      apiClient,
      new LocalPluginRepositoryMock(basePlugin),
      { ...options, yes: false },
      confirm,
    );

    expect(apiClient.file.uploadFile).not.toHaveBeenCalled();
    expect(apiClient.plugin.installPlugin).not.toHaveBeenCalled();
    expect(apiClient.plugin.updatePlugin).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenLastCalledWith(
      "Plugin installation is cancelled by the user.",
    );
    expect(infoSpy).not.toHaveBeenCalledWith(
      "Plugin is installed successfully.",
    );
  });

  it("should pass through the error when getting the installed plugins fails", async () => {
    const cause = new Error("getPlugins failed");
    apiClient.plugin.getPlugins = vi.fn().mockRejectedValue(cause);

    await expect(
      upload(
        apiClient,
        new LocalPluginRepositoryMock(basePlugin),
        options,
        confirm,
      ),
    ).rejects.toBe(cause);
    expect(apiClient.file.uploadFile).not.toHaveBeenCalled();
  });

  it("should pass through the error and not install the plugin when uploading the file fails", async () => {
    const cause = new Error("uploadFile failed");
    apiClient.file.uploadFile = vi.fn().mockRejectedValue(cause);
    const infoSpy = vi.spyOn(logger, "info");

    await expect(
      upload(
        apiClient,
        new LocalPluginRepositoryMock(basePlugin),
        options,
        confirm,
      ),
    ).rejects.toBe(cause);
    expect(apiClient.plugin.installPlugin).not.toHaveBeenCalled();
    expect(apiClient.plugin.updatePlugin).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalledWith(
      "Plugin is installed successfully.",
    );
  });

  it("should pass through the error when installing the plugin fails", async () => {
    const cause = new Error("installPlugin failed");
    apiClient.plugin.installPlugin = vi.fn().mockRejectedValue(cause);

    await expect(
      upload(
        apiClient,
        new LocalPluginRepositoryMock(basePlugin),
        options,
        confirm,
      ),
    ).rejects.toBe(cause);
  });

  it("should pass through the error when updating the plugin fails", async () => {
    installedAs("0.9.0");
    const cause = new Error("updatePlugin failed");
    apiClient.plugin.updatePlugin = vi.fn().mockRejectedValue(cause);

    await expect(
      upload(
        apiClient,
        new LocalPluginRepositoryMock(basePlugin),
        options,
        confirm,
      ),
    ).rejects.toBe(cause);
  });

  it("should pass through the error of the repository", async () => {
    const cause = new Error("broken zip");
    const repository = new LocalPluginRepositoryMock(basePlugin);
    vi.spyOn(repository, "read").mockRejectedValue(cause);

    await expect(upload(apiClient, repository, options, confirm)).rejects.toBe(
      cause,
    );
    expect(apiClient.plugin.getPlugins).not.toHaveBeenCalled();
  });
});

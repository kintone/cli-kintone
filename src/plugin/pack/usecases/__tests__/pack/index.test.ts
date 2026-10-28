import { vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import type { ManifestInterface } from "../../../../core";
import {
  LocalFSDriver,
  ManifestFactory,
  PluginZip,
  PrivateKey,
} from "../../../../core";
import { logger } from "../../../../../utils/log";
import { LocalPluginProjectRepositoryMock } from "../../../repositories/localPluginProjectRepositoryMock";
import { LocalPluginZipRepositoryMock } from "../../../repositories/localPluginZipRepositoryMock";
import { pack } from "../../pack";
import { PluginManifestValidationError } from "../../pack/error";

const fixturesDir = path.resolve(__dirname, "../../../__tests__/fixtures");
const sourceDir = path.join(fixturesDir, "plugin-full-manifest");

const loadManifest = async (
  update: (json: Record<string, unknown>) => void = () => undefined,
): Promise<ManifestInterface> => {
  const json = JSON.parse(
    await fs.readFile(path.join(sourceDir, "manifest.json"), "utf8"),
  );
  update(json);
  return ManifestFactory.parseJson(JSON.stringify(json));
};

const loadPrivateKey = async () =>
  PrivateKey.importKey(
    await fs.readFile(path.join(fixturesDir, "private.ppk"), "utf8"),
  );

describe("pack", () => {
  let privateKey: PrivateKey;

  beforeAll(async () => {
    privateKey = await loadPrivateKey();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const buildProject = async (manifest?: ManifestInterface) =>
    new LocalPluginProjectRepositoryMock(
      {
        manifest: manifest ?? (await loadManifest()),
        sources: new LocalFSDriver(sourceDir),
      },
      privateKey,
    );

  it("should save the plugin signed with the private key", async () => {
    const project = await buildProject();
    const readPrivateKeySpy = vi.spyOn(project, "readPrivateKey");
    const destination = new LocalPluginZipRepositoryMock("/out/plugin.zip");
    const prepareSpy = vi.spyOn(destination, "prepare");
    const infoSpy = vi.spyOn(logger, "info");

    const manifest = await pack(project, destination);

    expect(manifest.name).toBe("sample plugin");
    expect(prepareSpy).toHaveBeenCalledOnce();
    expect(prepareSpy.mock.invocationCallOrder[0]).toBeLessThan(
      readPrivateKeySpy.mock.invocationCallOrder[0],
    );
    expect(destination.savedPluginZips).toHaveLength(1);
    const pluginZip = await PluginZip.fromBuffer(
      destination.savedPluginZips[0].buffer,
    );
    await expect(pluginZip.getPluginID()).resolves.toBe(privateKey.uuid());
    await expect(pluginZip.manifest()).resolves.toMatchObject({
      name: "sample plugin",
    });
    expect(infoSpy).toHaveBeenCalledWith(
      "The plugin file generated: /out/plugin.zip",
    );
  });

  it("should print the warnings of the manifest and save the plugin", async () => {
    const manifest = await loadManifest((json) => {
      json.homepage_url = { en: "https://example.com/en/" };
    });
    const project = await buildProject(manifest);
    const destination = new LocalPluginZipRepositoryMock("/out/plugin.zip");
    const warnSpy = vi.spyOn(logger, "warn");
    vi.spyOn(logger, "info");

    await pack(project, destination);

    expect(warnSpy).toHaveBeenCalledWith(
      'Property "homepage_url.ja" is missing.',
    );
    expect(destination.savedPluginZips).toHaveLength(1);
  });

  it("should throw PluginManifestValidationError with the warnings printed when the manifest is invalid", async () => {
    const manifest = await loadManifest((json) => {
      json.homepage_url = { en: "https://example.com/en/" };
      json.icon = "image/none.png";
    });
    const project = await buildProject(manifest);
    const readPrivateKeySpy = vi.spyOn(project, "readPrivateKey");
    const destination = new LocalPluginZipRepositoryMock("/out/plugin.zip");
    const prepareSpy = vi.spyOn(destination, "prepare");
    const warnSpy = vi.spyOn(logger, "warn");

    await expect(pack(project, destination)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PluginManifestValidationError);
        expect(thrownError).toMatchObject({
          message: "Invalid manifest.json:",
          cause: expect.stringContaining('- "/icon" Error: ENOENT'),
        });
        return true;
      },
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'Property "homepage_url.ja" is missing.',
    );
    expect(prepareSpy).not.toHaveBeenCalled();
    expect(readPrivateKeySpy).not.toHaveBeenCalled();
    expect(destination.savedPluginZips).toHaveLength(0);
  });

  it("should throw the error of the project as is when the project cannot be read", async () => {
    const project = await buildProject();
    const error = new Error("cannot read");
    vi.spyOn(project, "read").mockRejectedValue(error);
    const destination = new LocalPluginZipRepositoryMock("/out/plugin.zip");

    await expect(pack(project, destination)).rejects.toBe(error);
    expect(destination.savedPluginZips).toHaveLength(0);
  });

  it("should throw the error of the destination as is before reading the private key when the destination cannot be prepared", async () => {
    const project = await buildProject();
    const readPrivateKeySpy = vi.spyOn(project, "readPrivateKey");
    const destination = new LocalPluginZipRepositoryMock("/out/plugin.zip");
    const error = new Error("cannot prepare");
    vi.spyOn(destination, "prepare").mockRejectedValue(error);

    await expect(pack(project, destination)).rejects.toBe(error);
    expect(readPrivateKeySpy).not.toHaveBeenCalled();
    expect(destination.savedPluginZips).toHaveLength(0);
  });

  it("should throw the error of the private key as is when the private key cannot be read", async () => {
    const project = await buildProject();
    const error = new Error("cannot import");
    vi.spyOn(project, "readPrivateKey").mockRejectedValue(error);
    const destination = new LocalPluginZipRepositoryMock("/out/plugin.zip");

    await expect(pack(project, destination)).rejects.toBe(error);
    expect(destination.savedPluginZips).toHaveLength(0);
  });
});

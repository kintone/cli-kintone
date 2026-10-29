import { vi } from "vitest";
import fs from "fs/promises";
import type { Stats } from "fs";
import os from "os";
import path from "path";
import { LocalPluginProjectRepositoryFromTemplate } from "../localPluginProjectRepositoryFromTemplate";
import { PluginProjectPathExistsError } from "../../usecases/init/error";
import { setupTemplate } from "../../utils/template";
import { installDependencies } from "../../utils/deps";
import { runKeygen } from "../../utils/keygen";

vi.mock("../../utils/template");
vi.mock("../../utils/deps");
vi.mock("../../utils/keygen");

const settings = {
  manifestPatch: { name: { en: "my-plugin" } },
  packageJsonPatch: { name: "my-plugin" },
};

describe("LocalPluginProjectRepositoryFromTemplate", () => {
  let workDir: string;
  let directory: string;
  let repository: LocalPluginProjectRepositoryFromTemplate;

  beforeEach(async () => {
    vi.resetAllMocks();
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-init-"),
    );
    directory = path.join(workDir, "my-plugin");
    repository = new LocalPluginProjectRepositoryFromTemplate({
      directory,
      templateName: "javascript",
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(workDir, { recursive: true, force: true });
  });

  describe("create", () => {
    it("should set up the template in the directory with the settings", async () => {
      await repository.create(settings);

      await expect(fs.stat(directory)).resolves.toSatisfy((stats: Stats) =>
        stats.isDirectory(),
      );
      expect(setupTemplate).toHaveBeenCalledExactlyOnceWith({
        outputDir: directory,
        templateName: "javascript",
        manifestPatch: settings.manifestPatch,
        packageJsonPatch: settings.packageJsonPatch,
      });
    });

    it("should throw PluginProjectPathExistsError without changing the directory when it already exists", async () => {
      const existingFilePath = path.join(directory, "existing.txt");
      await fs.mkdir(directory);
      await fs.writeFile(existingFilePath, "existing content", "utf8");

      await expect(repository.create(settings)).rejects.toSatisfy(
        (thrownError) => {
          expect(thrownError).toBeInstanceOf(PluginProjectPathExistsError);
          expect(thrownError).toMatchObject({
            cause: `${directory} already exists. Choose a different directory`,
          });
          return true;
        },
      );
      expect(setupTemplate).not.toHaveBeenCalled();
      await expect(fs.readFile(existingFilePath, "utf8")).resolves.toBe(
        "existing content",
      );
    });

    it("should throw PluginProjectPathExistsError without changing the file when a file exists at the path", async () => {
      await fs.writeFile(directory, "existing content", "utf8");

      await expect(repository.create(settings)).rejects.toBeInstanceOf(
        PluginProjectPathExistsError,
      );
      expect(setupTemplate).not.toHaveBeenCalled();
      await expect(fs.readFile(directory, "utf8")).resolves.toBe(
        "existing content",
      );
    });

    it("should throw PluginProjectPathExistsError when the path reaches an existing directory through a missing directory", async () => {
      await fs.mkdir(directory);
      const pathThroughMissingDirectory = [
        workDir,
        "missing",
        "..",
        "my-plugin",
      ].join(path.sep);
      const repositoryThroughMissingDirectory =
        new LocalPluginProjectRepositoryFromTemplate({
          directory: pathThroughMissingDirectory,
          templateName: "javascript",
        });

      await expect(
        repositoryThroughMissingDirectory.create(settings),
      ).rejects.toBeInstanceOf(PluginProjectPathExistsError);
      expect(setupTemplate).not.toHaveBeenCalled();
      await expect(fs.readdir(workDir)).resolves.toStrictEqual(["my-plugin"]);
    });

    it("should pass the error of setting up the template through", async () => {
      const error = new Error("Template not found");
      vi.mocked(setupTemplate).mockRejectedValue(error);

      await expect(repository.create(settings)).rejects.toBe(error);
    });
  });

  describe("installDependencies", () => {
    it("should install the dependencies in the directory", async () => {
      await repository.installDependencies();

      expect(installDependencies).toHaveBeenCalledExactlyOnceWith(directory);
    });
  });

  describe("generatePrivateKey", () => {
    it("should generate the private key in the directory", async () => {
      await repository.generatePrivateKey();

      expect(runKeygen).toHaveBeenCalledExactlyOnceWith(directory);
    });
  });

  describe("remove", () => {
    it("should remove the directory that create made", async () => {
      await repository.create(settings);
      await fs.writeFile(path.join(directory, "manifest.json"), "{}", "utf8");

      await repository.remove();

      await expect(fs.readdir(workDir)).resolves.toStrictEqual([]);
    });

    it("should remove the parent directories that create made", async () => {
      const nestedRepository = new LocalPluginProjectRepositoryFromTemplate({
        directory: path.join(workDir, "plugins", "my-plugin"),
        templateName: "javascript",
      });
      await nestedRepository.create(settings);

      await nestedRepository.remove();

      await expect(fs.readdir(workDir)).resolves.toStrictEqual([]);
    });

    it("should remove the directory that create made when the path goes through a missing directory", async () => {
      const repositoryThroughMissingDirectory =
        new LocalPluginProjectRepositoryFromTemplate({
          directory: [workDir, "missing", "..", "my-plugin"].join(path.sep),
          templateName: "javascript",
        });
      await repositoryThroughMissingDirectory.create(settings);

      await repositoryThroughMissingDirectory.remove();

      await expect(fs.readdir(workDir)).resolves.toStrictEqual([]);
    });

    it("should not remove the file that existed at the path before create", async () => {
      await fs.writeFile(directory, "existing content", "utf8");
      await expect(repository.create(settings)).rejects.toBeInstanceOf(
        PluginProjectPathExistsError,
      );

      await repository.remove();

      await expect(fs.readFile(directory, "utf8")).resolves.toBe(
        "existing content",
      );
    });

    it("should not throw when removing the directory fails", async () => {
      await repository.create(settings);
      const rmSpy = vi.spyOn(fs, "rm").mockRejectedValue(new Error("EBUSY"));

      await expect(repository.remove()).resolves.toBeUndefined();
      expect(rmSpy).toHaveBeenCalledExactlyOnceWith(directory, {
        recursive: true,
        force: true,
      });
    });
  });
});

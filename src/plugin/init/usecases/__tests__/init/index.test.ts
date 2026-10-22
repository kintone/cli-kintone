import { vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { logger } from "../../../../../utils/log";
import { initPlugin, type InitPluginSteps } from "../../init";
import {
  PluginDirectoryExistsError,
  PluginProjectCreationError,
} from "../../init/error";

describe("initPlugin", () => {
  let workDir: string;
  let projectName: string;
  let steps: {
    [K in keyof InitPluginSteps]: ReturnType<typeof vi.fn<InitPluginSteps[K]>>;
  };

  beforeEach(async () => {
    workDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-init-"),
    );
    projectName = path.join(workDir, "my-plugin");
    steps = {
      runPrompt: vi.fn<InitPluginSteps["runPrompt"]>().mockResolvedValue({
        projectName,
        name: { en: "my-plugin" },
      }),
      setupTemplate: vi
        .fn<InitPluginSteps["setupTemplate"]>()
        .mockImplementation(async ({ outputDir }) => {
          await fs.promises.mkdir(outputDir);
        }),
      installDependencies: vi.fn<InitPluginSteps["installDependencies"]>(),
      runKeygen: vi.fn<InitPluginSteps["runKeygen"]>(),
    };
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.promises.rm(workDir, { recursive: true, force: true });
  });

  const options = {
    name: "my-plugin",
    lang: "en",
    template: "javascript",
  } as const;

  it("should set up the template, install the dependencies and generate the private key in order", async () => {
    const infoSpy = vi.spyOn(logger, "info");

    await initPlugin(options, steps);

    expect(steps.runPrompt).toHaveBeenCalledWith(
      expect.any(Function),
      "my-plugin",
    );
    expect(steps.setupTemplate).toHaveBeenCalledExactlyOnceWith({
      outputDir: projectName,
      templateName: "javascript",
      manifestPatch: {
        name: { en: "my-plugin" },
        description: undefined,
        homepage_url: undefined,
      },
      packageJsonPatch: { name: "my-plugin" },
    });
    expect(steps.installDependencies).toHaveBeenCalledExactlyOnceWith(
      projectName,
      "en",
    );
    expect(steps.runKeygen).toHaveBeenCalledExactlyOnceWith(projectName, "en");
    expect(steps.setupTemplate).toHaveBeenCalledBefore(
      steps.installDependencies,
    );
    expect(steps.installDependencies).toHaveBeenCalledBefore(steps.runKeygen);
    expect(infoSpy).toHaveBeenLastCalledWith(
      expect.stringContaining(`Success! Created my-plugin at ${projectName}`),
    );
    await expect(fs.promises.stat(projectName)).resolves.toBeDefined();
  });

  it("should throw PluginDirectoryExistsError without changing the directory when it already exists", async () => {
    const existingFilePath = path.join(projectName, "existing.txt");
    await fs.promises.mkdir(projectName);
    await fs.promises.writeFile(existingFilePath, "existing content", "utf8");

    await expect(initPlugin(options, steps)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PluginDirectoryExistsError);
        expect(thrownError).toMatchObject({
          cause: `${projectName} already exists. Choose a different directory`,
        });
        return true;
      },
    );
    expect(steps.setupTemplate).not.toHaveBeenCalled();
    await expect(fs.promises.readFile(existingFilePath, "utf8")).resolves.toBe(
      "existing content",
    );
  });

  it("should throw PluginProjectCreationError after removing the directory when setting up the template fails", async () => {
    const cause = new Error("Template not found");
    steps.setupTemplate.mockImplementation(async ({ outputDir }) => {
      await fs.promises.mkdir(outputDir);
      throw cause;
    });

    await expect(initPlugin(options, steps)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PluginProjectCreationError);
        expect(thrownError).toMatchObject({ cause });
        return true;
      },
    );
    expect(steps.installDependencies).not.toHaveBeenCalled();
    await expect(fs.promises.stat(projectName)).rejects.toThrow("ENOENT");
  });

  it("should throw PluginProjectCreationError after removing the directory when installing the dependencies fails", async () => {
    const cause = new Error("Installing dependencies were failed");
    steps.installDependencies.mockImplementation(() => {
      throw cause;
    });

    await expect(initPlugin(options, steps)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PluginProjectCreationError);
        expect(thrownError).toMatchObject({ cause });
        return true;
      },
    );
    expect(steps.runKeygen).not.toHaveBeenCalled();
    await expect(fs.promises.stat(projectName)).rejects.toThrow("ENOENT");
  });

  it("should throw PluginProjectCreationError after removing the directory when generating the private key fails", async () => {
    const cause = new Error("Generating private key failed");
    steps.runKeygen.mockImplementation(() => {
      throw cause;
    });

    await expect(initPlugin(options, steps)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PluginProjectCreationError);
        expect(thrownError).toMatchObject({ cause });
        return true;
      },
    );
    await expect(fs.promises.stat(projectName)).rejects.toThrow("ENOENT");
  });

  it("should throw PluginProjectCreationError with the original cause when removing the directory also fails", async () => {
    const cause = new Error("Generating private key failed");
    steps.runKeygen.mockImplementation(() => {
      throw cause;
    });
    const rmSpy = vi
      .spyOn(fs.promises, "rm")
      .mockRejectedValue(new Error("EBUSY"));

    await expect(initPlugin(options, steps)).rejects.toSatisfy(
      (thrownError) => {
        expect(thrownError).toBeInstanceOf(PluginProjectCreationError);
        expect(thrownError).toMatchObject({ cause });
        return true;
      },
    );
    expect(rmSpy).toHaveBeenCalledExactlyOnceWith(projectName, {
      recursive: true,
      force: true,
    });
  });
});

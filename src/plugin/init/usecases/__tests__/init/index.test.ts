import { vi } from "vitest";
import { logger } from "../../../../../utils/log";
import { LocalPluginProjectRepositoryMock } from "../../../repositories/localPluginProjectRepositoryMock";
import { initPlugin } from "../../init";
import {
  PluginProjectPathExistsError,
  PluginProjectCreationError,
} from "../../init/error";

const answers = {
  projectName: "path/to/my-plugin",
  name: { en: "my-plugin" },
};

describe("initPlugin", () => {
  let project: LocalPluginProjectRepositoryMock;

  beforeEach(() => {
    project = new LocalPluginProjectRepositoryMock({
      directory: answers.projectName,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create the project, install the dependencies and generate the private key in order", async () => {
    const infoSpy = vi.spyOn(logger, "info");

    await initPlugin(answers, project);

    expect(project.steps).toStrictEqual([
      "create",
      "installDependencies",
      "generatePrivateKey",
    ]);
    expect(project.settings).toStrictEqual({
      manifestPatch: {
        name: { en: "my-plugin" },
        description: undefined,
        homepage_url: undefined,
      },
      packageJsonPatch: { name: "my-plugin" },
    });
    expect(infoSpy).toHaveBeenLastCalledWith(
      expect.stringContaining(
        "Success! Created my-plugin at path/to/my-plugin",
      ),
    );
  });

  it("should pass PluginProjectPathExistsError through without removing the directory", async () => {
    project = new LocalPluginProjectRepositoryMock({
      directory: answers.projectName,
      exists: true,
    });

    await expect(initPlugin(answers, project)).rejects.toThrow(
      PluginProjectPathExistsError,
    );
    expect(project.steps).toStrictEqual([]);
  });

  it.each([
    ["creating the project", "create"],
    ["installing the dependencies", "installDependencies"],
    ["generating the private key", "generatePrivateKey"],
  ] as const)(
    "should throw PluginProjectCreationError after removing the project when %s fails",
    async (_, step) => {
      const cause = new Error(`${step} failed`);
      vi.spyOn(project, step).mockRejectedValue(cause);

      await expect(initPlugin(answers, project)).rejects.toSatisfy(
        (thrownError) => {
          expect(thrownError).toBeInstanceOf(PluginProjectCreationError);
          expect(thrownError).toMatchObject({ cause });
          return true;
        },
      );
      expect(project.steps.at(-1)).toBe("remove");
    },
  );

  it("should not run the later steps after a step fails", async () => {
    vi.spyOn(project, "installDependencies").mockRejectedValue(
      new Error("Installing dependencies were failed"),
    );

    await expect(initPlugin(answers, project)).rejects.toThrow(
      PluginProjectCreationError,
    );
    expect(project.steps).toStrictEqual(["create", "remove"]);
  });
});

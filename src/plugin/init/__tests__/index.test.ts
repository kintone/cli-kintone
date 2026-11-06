import { vi } from "vitest";
import type { MockInstance } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { run } from "..";
import { logger } from "../../../utils/log";
import type { Logger } from "../../../utils/log";
import { runPrompt } from "../utils/qa";
import { setupTemplate } from "../utils/template";
import { installDependencies } from "../utils/deps";
import { runKeygen } from "../utils/keygen";

vi.mock("../utils/qa");
vi.mock("../utils/template");
vi.mock("../utils/deps");
vi.mock("../utils/keygen");

class ProcessExitError extends Error {}

// The logger prints an error through its toString().
const printedErrors = (errorSpy: MockInstance<Logger["error"]>) =>
  errorSpy.mock.calls.map(([message]) => String(message));

describe("run", () => {
  let workDir: string;
  let projectName: string;

  beforeEach(async () => {
    vi.resetAllMocks();
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-init-"),
    );
    projectName = path.join(workDir, "my-plugin");
    vi.mocked(runPrompt).mockResolvedValue({
      projectName,
      name: { en: "my-plugin" },
    });
    vi.mocked(setupTemplate).mockImplementation(async ({ outputDir }) => {
      await fs.writeFile(path.join(outputDir, "manifest.json"), "{}", "utf8");
    });
    vi.spyOn(process, "exit").mockImplementation(() => {
      throw new ProcessExitError();
    });
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should exit with 1 without changing the directory when it already exists", async () => {
    const existingFilePath = path.join(projectName, "existing.txt");
    await fs.mkdir(projectName);
    await fs.writeFile(existingFilePath, "existing content", "utf8");
    const errorSpy = vi.spyOn(logger, "error");

    await expect(
      run({ name: projectName, template: "javascript" }),
    ).rejects.toThrow(ProcessExitError);

    expect(printedErrors(errorSpy)).toStrictEqual([
      `Could not create a plug-in project.\n${projectName} already exists. Choose a different directory\n`,
    ]);
    expect(process.exit).toHaveBeenCalledExactlyOnceWith(1);
    expect(setupTemplate).not.toHaveBeenCalled();
    await expect(fs.readFile(existingFilePath, "utf8")).resolves.toBe(
      "existing content",
    );
  });

  it("should exit with 1 after removing the directory when setting up the template fails", async () => {
    vi.mocked(setupTemplate).mockImplementation(async ({ outputDir }) => {
      await fs.writeFile(path.join(outputDir, "manifest.json"), "{}", "utf8");
      throw new Error("Template not found");
    });
    const errorSpy = vi.spyOn(logger, "error");

    await expect(
      run({ name: projectName, template: "javascript" }),
    ).rejects.toThrow(ProcessExitError);

    expect(printedErrors(errorSpy)).toStrictEqual([
      "Could not create a plug-in project.\nError: Template not found\n",
    ]);
    expect(process.exit).toHaveBeenCalledExactlyOnceWith(1);
    expect(installDependencies).not.toHaveBeenCalled();
    await expect(fs.stat(projectName)).rejects.toThrow("ENOENT");
  });

  it("should exit with 1 after removing the directory when installing the dependencies fails", async () => {
    vi.mocked(installDependencies).mockImplementation(() => {
      throw new Error("Installing dependencies were failed");
    });
    const errorSpy = vi.spyOn(logger, "error");

    await expect(
      run({ name: projectName, template: "javascript" }),
    ).rejects.toThrow(ProcessExitError);

    expect(printedErrors(errorSpy)).toStrictEqual([
      "Could not create a plug-in project.\nError: Installing dependencies were failed\n",
    ]);
    expect(process.exit).toHaveBeenCalledExactlyOnceWith(1);
    expect(runKeygen).not.toHaveBeenCalled();
    await expect(fs.stat(projectName)).rejects.toThrow("ENOENT");
  });

  it("should exit with 1 after removing the directory when generating the private key fails", async () => {
    vi.mocked(runKeygen).mockImplementation(() => {
      throw new Error("Generating private key failed");
    });
    const errorSpy = vi.spyOn(logger, "error");

    await expect(
      run({ name: projectName, template: "javascript" }),
    ).rejects.toThrow(ProcessExitError);

    expect(printedErrors(errorSpy)).toStrictEqual([
      "Could not create a plug-in project.\nError: Generating private key failed\n",
    ]);
    expect(process.exit).toHaveBeenCalledExactlyOnceWith(1);
    await expect(fs.stat(projectName)).rejects.toThrow("ENOENT");
  });

  it("should print a thrown value that is not an Error as a string", async () => {
    vi.mocked(setupTemplate).mockRejectedValue("unexpected failure");
    const errorSpy = vi.spyOn(logger, "error");

    await expect(
      run({ name: projectName, template: "javascript" }),
    ).rejects.toThrow(ProcessExitError);

    expect(printedErrors(errorSpy)).toStrictEqual([
      "Could not create a plug-in project.\nunexpected failure\n",
    ]);
    expect(process.exit).toHaveBeenCalledExactlyOnceWith(1);
  });
});

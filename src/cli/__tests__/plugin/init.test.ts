import { vi } from "vitest";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { runCliWithDefaultAnswers } from "../cliHelper";

vi.setConfig({ testTimeout: 30000 });

// The init handler only prints its arguments when NODE_ENV is "test", which vitest sets.
const env = { ...process.env, NODE_ENV: "production" };

describe("plugin init", () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-init-"),
    );
  });

  afterEach(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should fail without changing the directory when it already exists", async () => {
    const existingFilePath = path.join(workDir, "my-plugin", "existing.txt");
    await fs.mkdir(path.dirname(existingFilePath));
    await fs.writeFile(existingFilePath, "existing content", "utf8");

    const result = await runCliWithDefaultAnswers(
      ["plugin", "init", "--name", "my-plugin"],
      workDir,
      env,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: [
        "✔ Input your plug-in name in English [1-64chars] my-plugin",
        "✔ Input your plug-in description in English [1-200chars] my-plugin",
        "✔ Input your home page url for English (Optional) ",
        "✔ Does your plug-in support Japanese? No",
        "✔ Does your plug-in support Chinese? No",
        "✔ Does your plug-in support Spanish? No",
        "",
      ].join("\n"),
      stderr: [
        "INFO:   ",
        "INFO: Please answer some questions to create your Kintone plug-in project :)",
        "INFO: Let's start!",
        "INFO:     ",
        "INFO:   ",
        "INFO: Starting to set up template...",
        "ERROR: Could not create a plug-in project.",
        "ERROR: my-plugin already exists. Choose a different directory",
        "",
      ].join("\n"),
    });
    await expect(
      fs.readdir(path.dirname(existingFilePath)),
    ).resolves.toStrictEqual(["existing.txt"]);
    await expect(fs.readFile(existingFilePath, "utf8")).resolves.toBe(
      "existing content",
    );
  });
});

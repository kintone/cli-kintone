import { vi } from "vitest";
import childProcess from "child_process";
import { realpathSync } from "fs";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";

const projectRoot = path.resolve(__dirname, "../../../../");
const execFile = promisify(childProcess.execFile);
const packageJson = require(path.resolve(projectRoot, "package.json"));
const mainFilePath = path.resolve(projectRoot, packageJson.bin["cli-kintone"]);

vi.setConfig({ testTimeout: 30000 });

type CliResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

const isExecFileError = (
  error: unknown,
): error is { code: number; stdout: string; stderr: string } =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  typeof error.code === "number" &&
  "stdout" in error &&
  "stderr" in error;

// Each line of stderr starts with "[<timestamp>] ", which changes on every run.
const removeTimestamps = (stderr: string): string =>
  stderr.replace(/^\[[^\]]+\] /gm, "");

const runCli = async (args: string[], cwd: string): Promise<CliResult> => {
  try {
    const { stdout, stderr } = await execFile("node", [mainFilePath, ...args], {
      cwd,
    });
    return { exitCode: 0, stdout, stderr: removeTimestamps(stderr) };
  } catch (error) {
    if (!isExecFileError(error)) {
      throw error;
    }
    return {
      exitCode: error.code,
      stdout: error.stdout,
      stderr: removeTimestamps(error.stderr),
    };
  }
};

describe("plugin keygen", () => {
  let workDir: string;

  beforeEach(async () => {
    const tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "cli-kintone-plugin-keygen-"),
    );
    // The CLI prints the absolute path resolved from its cwd, so compare it with the real path.
    workDir = realpathSync.native(tempDir);
  });

  afterEach(async () => {
    await fs.rm(workDir, { recursive: true, force: true });
  });

  it("should write the private key to the specified path", async () => {
    const outputPath = path.join(workDir, "private.ppk");

    const result = await runCli(
      ["plugin", "keygen", "--output", outputPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: `INFO: New private key generated: ${outputPath}\n`,
    });
    await expect(fs.readFile(outputPath, "utf8")).resolves.toMatch(
      /^-----BEGIN RSA PRIVATE KEY-----\n/,
    );
  });

  it("should write the private key to <plugin_id>.ppk in the cwd when the output is omitted", async () => {
    const result = await runCli(["plugin", "keygen"], workDir);

    const files = await fs.readdir(workDir);
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^[a-p]{32}\.ppk$/);
    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: `INFO: New private key generated: ${path.join(workDir, files[0])}\n`,
    });
  });

  it("should create the parent directories of the output", async () => {
    const outputPath = path.join(workDir, "nested", "dir", "private.ppk");

    const result = await runCli(
      ["plugin", "keygen", "--output", outputPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: "",
      stderr: `INFO: New private key generated: ${outputPath}\n`,
    });
    await expect(fs.readFile(outputPath, "utf8")).resolves.toMatch(
      /^-----BEGIN RSA PRIVATE KEY-----\n/,
    );
  });

  it("should fail without overwriting when the output already exists", async () => {
    const outputPath = path.join(workDir, "private.ppk");
    await fs.writeFile(outputPath, "existing content", "utf8");

    const result = await runCli(
      ["plugin", "keygen", "--output", outputPath],
      workDir,
    );

    expect(result).toStrictEqual({
      exitCode: 1,
      stdout: "",
      stderr: `ERROR: Failed to generate a private key.\nERROR: File ${outputPath} already exists.\n`,
    });
    await expect(fs.readFile(outputPath, "utf8")).resolves.toBe(
      "existing content",
    );
  });
});

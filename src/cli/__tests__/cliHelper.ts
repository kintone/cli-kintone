import childProcess from "child_process";
import path from "path";
import { promisify } from "util";

const projectRoot = path.resolve(__dirname, "../../../");
const exec = promisify(childProcess.exec);
const execFile = promisify(childProcess.execFile);
const packageJson = require(path.resolve(projectRoot, "package.json"));

export const mainFilePath = path.resolve(
  projectRoot,
  packageJson.bin["cli-kintone"],
);

export type CliResult = {
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

export const runCli = async (
  args: string[],
  cwd: string,
  env?: NodeJS.ProcessEnv,
): Promise<CliResult> => {
  try {
    const { stdout, stderr } = await execFile("node", [mainFilePath, ...args], {
      cwd,
      env,
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

export const checkRejectArg = ({
  arg,
  errorMessage,
  env,
}: {
  arg: string;
  errorMessage: string | RegExp;
  env?: NodeJS.ProcessEnv;
}) => {
  return expect(
    exec(`cross-env LC_ALL='en_US' node ${mainFilePath} ${arg}`, { env }),
  ).rejects.toThrow(errorMessage);
};

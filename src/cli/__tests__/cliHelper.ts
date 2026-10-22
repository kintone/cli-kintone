import childProcess from "child_process";
import path from "path";
import { promisify, stripVTControlCharacters } from "util";

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

// A prompt redraws its line after moving the cursor to the first column, so only the text after the last move remains on the screen.
const toScreenLine = (line: string): string =>
  stripVTControlCharacters(line.slice(Math.max(line.lastIndexOf("\x1b[G"), 0)));

const toScreenText = (stdout: string): string =>
  stdout.split("\n").map(toScreenLine).join("\n");

// A prompt ignores the input sent before it is shown, so press Enter once each time a new prompt is shown.
export const runCliWithDefaultAnswers = (
  args: string[],
  cwd: string,
  env?: NodeJS.ProcessEnv,
): Promise<CliResult> =>
  new Promise((resolve, reject) => {
    const child = childProcess.spawn("node", [mainFilePath, ...args], {
      cwd,
      env,
    });
    let stdout = "";
    let stderr = "";
    let answeredCount = 0;
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
      // A prompt ends its line when it is answered.
      const finishedLineCount = stdout.split("\n").length - 1;
      const currentLine = stdout.slice(stdout.lastIndexOf("\n") + 1);
      if (
        answeredCount === finishedLineCount &&
        toScreenLine(currentLine).startsWith("?")
      ) {
        answeredCount++;
        child.stdin.write("\n");
      }
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === null) {
        reject(new Error("The CLI was terminated by a signal"));
        return;
      }
      resolve({
        exitCode: code,
        stdout: toScreenText(stdout),
        stderr: removeTimestamps(stderr),
      });
    });
  });

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

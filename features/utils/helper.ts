import { spawnSync } from "child_process";
import path from "path";
import fs from "fs/promises";

export const execCliKintoneSync = (
  args: string,
  options?: { env?: { [key: string]: string }; cwd?: string },
) => {
  const response = spawnSync(
    getCliKintoneBinary(),
    replaceTokenWithEnvVars(args, options?.env).split(/\s+/),
    {
      encoding: "utf-8",
      env: options?.env ?? {},
      cwd: options?.cwd ?? process.cwd(),
    },
  );
  if (response.error) {
    throw response.error;
  }
  return response;
};

export const getCliKintoneBinary = (): string => {
  const dir = path.join(__dirname, "..", "..", "bin");
  switch (process.platform) {
    case "darwin":
      return path.join(dir, "cli-kintone-macos");
    case "linux":
      return path.join(dir, "cli-kintone-linux");
    case "win32":
      return path.join(dir, "cli-kintone-win.exe");
    default:
      throw new Error(`Unsupported platform ${process.platform}`);
  }
};

const replaceTokenWithEnvVars = (
  input: string,
  envVars: { [key: string]: string } | undefined,
) =>
  input
    .replace(/\$\$[a-zA-Z0-9_]+/g, processEnvReplacer)
    .replace(/\$[a-zA-Z0-9_]+/g, inputEnvReplacer(envVars));

const processEnvReplacer = (substring: string) => {
  const key = substring.replace("$$", "");
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`The env variable in process.env is missing: ${key}`);
  }
  return value;
};

const inputEnvReplacer = (envVars: { [key: string]: string } | undefined) => {
  return (substring: string) => {
    if (!envVars) {
      return substring;
    }

    const key = substring.replace("$", "");
    const value = envVars[key];
    if (value === undefined) {
      throw new Error(`The env variable in input parameter is missing: ${key}`);
    }
    return value;
  };
};

export const createCsvFile = async (
  inputCsvObject: string[][],
  options: { baseDir?: string; destFilePath?: string },
): Promise<string> => {
  const csvContent = inputCsvObject
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  let filePath = options.destFilePath;
  if (filePath) {
    filePath = options.baseDir
      ? path.join(options.baseDir, filePath)
      : filePath;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  } else {
    const prefix = "cli-kintone-csv-file-";
    const tempDir = await fs.mkdtemp(
      options.baseDir ? path.join(options.baseDir, prefix) : prefix,
    );
    filePath = path.join(tempDir, "records.csv");
  }

  await fs.writeFile(filePath, csvContent);

  return filePath;
};

export const createFile = async (
  content: string,
  filePath: string,
  options: { baseDir?: string },
) => {
  const actualFilePath = options.baseDir
    ? path.join(options.baseDir, filePath)
    : filePath;
  await fs.mkdir(path.dirname(actualFilePath), { recursive: true });
  await fs.writeFile(actualFilePath, content);

  return actualFilePath;
};

import { spawnSync } from "child_process";
import path from "path";
import fs from "fs/promises";

export const execCliKintoneSync = (
  args: string,
  options?: { env?: { [key: string]: string }; cwd?: string },
) => {
  const response = spawnSync(
    getCliKintoneBinary(),
    replaceTokenWithEnvVars(args).split(/\s+/),
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

export const replaceTokenWithEnvVars = (input: string) =>
  input.replace(/\$\$[a-zA-Z0-9_]+/g, replacer);

const replacer = (substring: string) => {
  const key = substring.replace("$$", "");
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`The env variable is missing: ${key}`);
  }
  return value;
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

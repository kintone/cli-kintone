import { spawnSync } from "child_process";
import path from "path";
import fs from "fs/promises";
import iconv from "iconv-lite";

export const SUPPORTED_ENCODING = <const>["utf8", "sjis"];

export type SupportedEncoding = (typeof SUPPORTED_ENCODING)[number];

export type ReplacementValue = string | string[] | number | number[] | boolean;

export type Replacements = { [key: string]: ReplacementValue };

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

export const generateCsvFile = async (
  csvContent: string,
  options: {
    baseDir?: string;
    destFilePath?: string;
    encoding?: SupportedEncoding;
  },
): Promise<string> => {
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

  await _writeFile(csvContent, filePath, { encoding: options.encoding });

  return filePath;
};

export const generateFile = async (
  content: string,
  filePath: string,
  options: { baseDir?: string; encoding?: SupportedEncoding },
): Promise<string> => {
  const actualFilePath = options.baseDir
    ? path.join(options.baseDir, filePath)
    : filePath;
  await fs.mkdir(path.dirname(actualFilePath), { recursive: true });
  await _writeFile(content, actualFilePath, { encoding: options.encoding });

  return actualFilePath;
};

const _writeFile = async (
  content: string,
  filePath: string,
  options?: { encoding?: SupportedEncoding },
): Promise<void> => {
  if (options && options.encoding) {
    return fs.writeFile(filePath, iconv.encode(content, options.encoding));
  }

  return fs.writeFile(filePath, content);
};

export const getRecordNumbers = (appId: string, apiToken: string): string[] => {
  const command = `record export --app ${appId} --base-url $$TEST_KINTONE_BASE_URL --api-token ${apiToken} --fields Record_number`;
  const response = execCliKintoneSync(command);
  if (response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${response.stderr}`);
  }

  const recordNumbers = response.stdout.replace(/"/g, "").split("\n");
  recordNumbers.shift();

  return recordNumbers.filter((recordNumber) => recordNumber.length > 0);
};

export const replacePlaceholders = (
  str: string,
  replacements: Replacements,
): string => {
  return str.replace(
    /\$([a-zA-Z0-9_]*)(?:\[(\d+)])?/g,
    (match: string, placeholder: string, index?: number) => {
      if (replacements[placeholder] === undefined) {
        return match;
      }

      const replacementValue = replacements[placeholder];
      if (
        Array.isArray(replacementValue) &&
        index &&
        replacementValue[index] !== undefined
      ) {
        return replacementValue[index].toString();
      }

      return replacementValue.toString();
    },
  );
};

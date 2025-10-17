import { spawn, spawnSync } from "child_process";
import path from "path";
import { QueryBuilder } from "./queryBuilder";

export const SUPPORTED_ENCODING = <const>["utf8", "sjis"];
export type SupportedEncoding = (typeof SUPPORTED_ENCODING)[number];

export type ReplacementValue = string | string[] | number | number[] | boolean;
export type Replacements = { [key: string]: ReplacementValue };

export const execCliKintoneSync = (
  args: string,
  options?: {
    env?: { [key: string]: string };
    cwd?: string;
  },
) => {
  const response = spawnSync(
    getCliKintoneBinary(),
    parseArgs(args, options?.env),
    {
      env: options?.env ?? {},
      cwd: options?.cwd ?? process.cwd(),
    },
  );
  if (response.error) {
    throw response.error;
  }
  return response;
};

export const execCliKintone = (
  args: string,
  options: {
    env?: { [key: string]: string };
    cwd?: string;
  },
) => {
  return spawn(getCliKintoneBinary(), parseArgs(args, options?.env), {
    stdio: ["pipe", "pipe", "pipe"],
    env: options?.env ?? {},
    cwd: options?.cwd ?? process.cwd(),
  });
};

const parseArgs = (
  args: string,
  envVars: { [key: string]: string } | undefined,
) => {
  const replacedArgs = replaceTokenWithEnvVars(args, envVars).match(
    /(?:[^\s'"]+|"[^"]*"|'[^']*')+/g,
  );

  if (!replacedArgs) {
    throw new Error("Failed to parse command arguments.");
  }

  return replacedArgs.map((arg) => arg.replace(/^['"]|['"]$/g, ""));
};

export const getCliKintoneBinary = (): string => {
  const dir = path.join(__dirname, "..", "..", "bin");
  switch (process.platform) {
    case "darwin":
      return path.join(dir, "cli-kintone-macos-arm64");
    case "linux":
      return path.join(dir, "cli-kintone-linux-x64");
    case "win32":
      return path.join(dir, "cli-kintone-win-x64.exe");
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

export const getRecordNumbers = (
  appId: string,
  apiToken: string,
  options: { fieldCode?: string; guestSpaceId?: string } = {},
): string[] => {
  const recordNumberFieldCode = options.fieldCode ?? "Record_number";
  const command = QueryBuilder.record()
    .export({
      baseUrl: "$$TEST_KINTONE_BASE_URL",
      app: appId,
      apiToken,
      fields: [recordNumberFieldCode],
      guestSpaceId: options.guestSpaceId,
    })
    .getQuery();

  const response = execCliKintoneSync(command);
  if (response.status !== 0) {
    throw new Error(`Getting records failed. Error: \n${response.stderr}`);
  }

  const regex = /([a-zA-Z]+\d*)-(\d+)/g;
  const recordNumbers = response.stdout
    .toString()
    .replace(regex, (match, appCode, number) => number)
    .replace(/"/g, "")
    .split("\n");
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

export const generateCsvRow = (fields: string[]): string => {
  return fields
    .map((field: string) => {
      if (!field) {
        return "";
      }

      if (field === "*") {
        return `\\${field}`;
      }

      return `"${field}"`;
    })
    .join(",");
};

export const validateRequireColumnsInTable = (
  columns: string[],
  requiredColumns: string[],
) => {
  requiredColumns.forEach((requiredColumn) => {
    if (!columns.includes(requiredColumn)) {
      throw new Error(`The table should have ${requiredColumn} column.`);
    }
  });
};

export const compareBuffers = (buffer1: Buffer, buffer2: Buffer): boolean => {
  if (buffer1.length !== buffer2.length) {
    return false;
  }

  for (let i = 0; i < buffer1.length; i++) {
    if (buffer1[i] !== buffer2[i]) {
      return false;
    }
  }

  return true;
};

import { stderr as chalkStderr } from "chalk";
import { CliKintoneError } from "./error";

const currentISOString = () => new Date().toISOString();

export type Logger = {
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  debug: (message: any) => void;
};

export const logger: Logger = {
  info: (message: any) => {
    const prefix = `[${currentISOString()}] ${chalkStderr.blue("INFO")}:`;
    console.error(addPrefixEachLine(message, prefix));
  },

  warn: (message: any) => {
    const prefix = `[${currentISOString()}] ${chalkStderr.yellow("WARN")}:`;
    console.error(addPrefixEachLine(message, prefix));
  },

  error: (message: any) => {
    const parsedMessage = parseErrorMessage(message);
    const prefix = `[${currentISOString()}] ${chalkStderr.red("ERROR")}:`;
    console.error(addPrefixEachLine(parsedMessage, prefix));
  },

  debug: (message: any) => {
    return; // TODO: Decide how enable debug log
    const prefix = `[${currentISOString()}] ${chalkStderr.yellow("DEBUG")}:`;
    console.error(addPrefixEachLine(message, prefix));
  },
};

const addPrefixEachLine = (message: any, prefix: string): string =>
  ("" + message)
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => `${prefix} ${line}`)
    .join("\n");

const parseErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error instanceof CliKintoneError) {
      return error.toString();
    }
    return "" + error;
  }
  return "" + error;
};

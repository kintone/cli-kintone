import { AddRecordsError } from "../usecases/add/error";
import { UpsertRecordsError } from "../usecases/upsert/error";
import { ParserError } from "../parsers/error";
import chalk from "chalk";

const currentISOString = () => new Date().toISOString();

export const logger = {
  info: (message: any) => {
    const prefix = `[${currentISOString()}] ${chalk.blue("INFO")}:`;
    console.error(addPrefixEachLine(message, prefix));
  },

  warn: (message: any) => {
    const prefix = `[${currentISOString()}] ${chalk.yellow("WARN")}:`;
    console.error(addPrefixEachLine(message, prefix));
  },

  error: (message: any) => {
    const parsedMessage = parseErrorMessage(message);
    const prefix = `[${currentISOString()}] ${chalk.red("ERROR")}:`;
    console.error(addPrefixEachLine(parsedMessage, prefix));
  },

  debug: (message: any) => {
    return; // TODO: Decide how enable debug log
    const prefix = `[${currentISOString()}] ${chalk.yellow("DEBUG")}:`;
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
    if (error instanceof AddRecordsError) {
      return error.toString();
    } else if (error instanceof UpsertRecordsError) {
      return error.toString();
    } else if (error instanceof ParserError) {
      return error.toString();
    }
    return "" + error;
  }
  return "" + error;
};

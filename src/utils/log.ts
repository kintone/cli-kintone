import { stderr as chalkStderr } from "chalk";
import { CliKintoneError } from "./error";
import { WinstonLoggerService } from "./log.service";

const currentISOString = () => new Date().toISOString();

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export const SUPPORTED_LOG_LEVELS: LogLevel[] = [
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
];

export interface LoggerInterface {
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  fatal: (message: any) => void;
}

export interface LoggerModuleInterface {
  setLoggerLevel(level: string): void;
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  fatal: (message: any) => void;
}

class Logger implements LoggerInterface {
  constructor(
    private logLevel: string = "info",
    private logModule: LoggerModuleInterface = new WinstonLoggerService(),
  ) {
    this.logModule = logModule;
    this.logModule.setLoggerLevel(logLevel);
  }

  debug(message: any): void {
    this.logModule.debug(message);
  }

  error(message: any): void {
    this.logModule.error(message);
  }

  fatal(message: any): void {
    this.logModule.fatal(message);
  }

  info(message: any): void {
    this.logModule.info(message);
  }

  warn(message: any): void {
    this.logModule.warn(message);
  }

  updateLogConfigLevel(level: string): void {
    this.logModule.setLoggerLevel(level);
  }
}

export const logger: Logger = {
  debug: (message: any) => {
    const prefix = `[${currentISOString()}] ${chalkStderr.green("DEBUG")}:`;
    console.error(addPrefixEachLine(message, prefix));
  },

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

  fatal: (message: any) => {
    const prefix = `[${currentISOString()}] ${chalkStderr.bgRed("FATAL")}:`;
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

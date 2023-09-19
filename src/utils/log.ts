import { stderr as chalkStderr } from "chalk";
import { CliKintoneError } from "./error";

export interface Logger {
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  fatal: (message: any) => void;
}

type LogEventLevel = "debug" | "info" | "warn" | "error" | "fatal";

type LogEvent = {
  level: LogEventLevel;
  message: any;
};

type LogConfigLevel = "debug" | "info" | "warn" | "error" | "fatal" | "none";

type Printer = (data: any) => void;

class StandardLogger implements Logger {
  private readonly printer: Printer = console.error;

  private logConfigLevel: LogConfigLevel = "info";

  constructor(options?: {
    logConfigLevel?: LogConfigLevel;
    printer?: Printer;
  }) {
    if (options?.printer) {
      this.printer = options.printer;
    }
    if (options?.logConfigLevel) {
      this.logConfigLevel = options.logConfigLevel;
    }
  }

  public debug = (message: any): void => {
    this.log({ level: "debug", message });
  };
  public info = (message: any): void => {
    this.log({ level: "info", message });
  };
  public warn = (message: any): void => {
    this.log({ level: "warn", message });
  };
  public error = (message: any): void => {
    this.log({ level: "error", message });
  };
  public fatal = (message: any): void => {
    this.log({ level: "fatal", message });
  };

  private log = (event: LogEvent): void => {
    const filteredEvent = this.filter(event);
    if (!filteredEvent) {
      return;
    }
    const text = this.format(filteredEvent);
    this.print(text);
  };

  private filter = (event: LogEvent): LogEvent | undefined => {};

  private format = (event: LogEvent): string => {};

  private print = (text: string): void => {
    this.printer(text);
  };
}

export const logger = new StandardLogger();

const currentISOString = () => new Date().toISOString();

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

//
// export const logger: Logger = {
//   debug: (message: any) => {
//     const prefix = `[${currentISOString()}] ${chalkStderr.green("DEBUG")}:`;
//     console.error(addPrefixEachLine(message, prefix));
//   },
//
//   info: (message: any) => {
//     const prefix = `[${currentISOString()}] ${chalkStderr.blue("INFO")}:`;
//     console.error(addPrefixEachLine(message, prefix));
//   },
//
//   warn: (message: any) => {
//     const prefix = `[${currentISOString()}] ${chalkStderr.yellow("WARN")}:`;
//     console.error(addPrefixEachLine(message, prefix));
//   },
//
//   error: (message: any) => {
//     const parsedMessage = parseErrorMessage(message);
//     const prefix = `[${currentISOString()}] ${chalkStderr.red("ERROR")}:`;
//     console.error(addPrefixEachLine(parsedMessage, prefix));
//   },
//
//   fatal: (message: any) => {
//     const prefix = `[${currentISOString()}] ${chalkStderr.bgRed("FATAL")}:`;
//     console.error(addPrefixEachLine(message, prefix));
//   },
// };

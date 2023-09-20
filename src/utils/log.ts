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
    if (!this.isPrintable(event)) {
      return;
    }

    const formattedMessage = this.format(event);
    this.print(formattedMessage);
  };

  private isPrintable = (event: LogEvent): boolean => {
    const logConfigLevelMatrix: {
      [configLevel in LogConfigLevel]: LogEventLevel[];
    } = {
      debug: ["debug", "info", "warn", "error", "fatal"],
      info: ["info", "warn", "error", "fatal"],
      warn: ["warn", "error", "fatal"],
      error: ["error", "fatal"],
      fatal: ["fatal"],
      none: [],
    };

    return logConfigLevelMatrix[this.logConfigLevel].includes(event.level);
  };

  private format = (event: LogEvent): string => {
    const timestamp = new Date().toISOString();
    const eventLevelLabels: { [level in LogEventLevel]: string } = {
      debug: chalkStderr.green("DEBUG"),
      info: chalkStderr.blue("INFO"),
      warn: chalkStderr.yellow("WARN"),
      error: chalkStderr.red("ERROR"),
      fatal: chalkStderr.bgRed("FATAL"),
    };
    const stringifiedMessage = stringifyMessage(event.message);
    const prefix = `[${timestamp}] ${eventLevelLabels[event.level]}:`;

    return stringifiedMessage
      .split("\n")
      .filter((line) => line.length > 0)
      .map((line) => `${prefix} ${line}`)
      .join("\n");
  };

  private print = (message: string): void => {
    this.printer(message);
  };
}

export const logger = new StandardLogger();

const stringifyMessage = (message: unknown): string => {
  if (message instanceof Error) {
    if (message instanceof CliKintoneError) {
      return message.toString();
    }
    return "" + message;
  }
  return "" + message;
};

import { stderr as chalkStderr } from "chalk";
import { CliKintoneError } from "./error";

export interface Logger {
  trace: (message: any) => void;
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  fatal: (message: any) => void;
}

export const LOG_CONFIG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "none",
] as const;

export type LogConfigLevel = (typeof LOG_CONFIG_LEVELS)[number];

export type LogEventLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export type LogEvent = {
  level: LogEventLevel;
  message: any;
};

export type Printer = (data: any) => void;

export class StandardLogger implements Logger {
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

  trace(message: any): void {
    this.log({ level: "trace", message });
  }

  debug(message: any): void {
    this.log({ level: "debug", message });
  }

  info(message: any): void {
    this.log({ level: "info", message });
  }

  warn(message: any): void {
    this.log({ level: "warn", message });
  }

  error(message: any): void {
    this.log({ level: "error", message });
  }

  fatal(message: any): void {
    this.log({ level: "fatal", message });
  }

  private log(event: LogEvent): void {
    if (!this.isPrintable(event)) {
      return;
    }

    const formattedMessage = this.format(event);
    this.print(formattedMessage);
  }

  private isPrintable(event: LogEvent): boolean {
    const logConfigLevelMatrix: {
      [configLevel in LogConfigLevel]: LogEventLevel[];
    } = {
      trace: ["trace", "debug", "info", "warn", "error", "fatal"],
      debug: ["debug", "info", "warn", "error", "fatal"],
      info: ["info", "warn", "error", "fatal"],
      warn: ["warn", "error", "fatal"],
      error: ["error", "fatal"],
      fatal: ["fatal"],
      none: [],
    };

    return logConfigLevelMatrix[this.logConfigLevel].includes(event.level);
  }

  private format(event: LogEvent): string {
    const timestamp = new Date().toISOString();
    const eventLevelLabels: { [level in LogEventLevel]: string } = {
      trace: chalkStderr.bgGreen("TRACE"),
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
  }

  private print(message: string): void {
    this.printer(message);
  }

  setLogConfigLevel(logConfigLevel: LogConfigLevel): void {
    this.logConfigLevel = logConfigLevel;
  }
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

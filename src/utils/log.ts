import { WinstonLoggerModule } from "./log.module";
import { CliKintoneError } from "./error";

export const SUPPORTED_LOG_EVENT_LEVELS = <const>[
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
];

export type LogEventLevel = (typeof SUPPORTED_LOG_EVENT_LEVELS)[number];

export const SUPPORTED_LOG_CONFIG_LEVELS = <const>[
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "none",
];

export type LogConfigLevel = (typeof SUPPORTED_LOG_CONFIG_LEVELS)[number];

export interface Logger {
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  fatal: (message: any) => void;
}

export interface LoggerModuleInterface {
  debug: (message: any) => void;
  info: (message: any) => void;
  warn: (message: any) => void;
  error: (message: any) => void;
  fatal: (message: any) => void;
  setLogConfigLevel: (level: LogConfigLevel) => void;
  silent: () => void;
}

export class CliKintoneLogger implements Logger {
  constructor(
    private logModule: LoggerModuleInterface = new WinstonLoggerModule(),
    private logConfigLevel: LogConfigLevel = "info",
  ) {
    this.setLogConfigLevel(logConfigLevel);
  }

  debug(message: any): void {
    this.logModule.debug(message);
  }

  info(message: any): void {
    this.logModule.info(message);
  }

  warn(message: any): void {
    this.logModule.warn(message);
  }

  error(message: any): void {
    this.logModule.error(this.parseErrorMessage(message));
  }

  fatal(message: any): void {
    this.logModule.fatal(message);
  }

  setLogConfigLevel(level: LogConfigLevel): void {
    if (level === "none") {
      this.logModule.silent();
      return;
    }

    this.logModule.setLogConfigLevel(level);
  }

  parseErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error instanceof CliKintoneError) {
        return error.toString();
      }
      return "" + error;
    }
    return "" + error;
  }
}

export const logger = new CliKintoneLogger();

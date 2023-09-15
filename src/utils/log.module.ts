import type {
  LoggerModuleInterface,
  LogEventLevel,
  LogConfigLevel,
} from "./log";
import winston from "winston";
import { stderr as chalkStderr } from "chalk";

const { combine, timestamp, printf } = winston.format;

type LoggerModule = winston.Logger &
  Record<keyof typeof logLevels.levels, winston.LeveledLogMethod>;

const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: chalkStderr.bgRed,
    error: chalkStderr.red,
    warn: chalkStderr.yellow,
    info: chalkStderr.blue,
    debug: chalkStderr.green,
  },
};

export const logFormat = (info: winston.Logform.TransformableInfo): string => {
  const prefix = `[${info.timestamp}] ${logLevels.colors[
    info.level as LogEventLevel
  ](info.level.toUpperCase())}:`;

  return addPrefixEachLine(info.message, prefix);
};

const addPrefixEachLine = (message: any, prefix: string): string =>
  ("" + message)
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => `${prefix} ${line}`)
    .join("\n");

export class WinstonLoggerModule implements LoggerModuleInterface {
  private logger: LoggerModule;
  constructor(private logLevel: string = "info") {
    this.logger = winston.createLogger({
      level: logLevel,
      levels: logLevels.levels,
      transports: [
        new winston.transports.Console({
          format: combine(timestamp(), printf(logFormat)),
          stderrLevels: Object.keys(logLevels.levels),
        }),
      ],
    }) as LoggerModule;
  }

  debug(message: any): void {
    this.logger.debug(message);
  }

  info(message: any): void {
    this.logger.info(message);
  }

  warn(message: any): void {
    this.logger.warn(message);
  }

  error(message: any): void {
    this.logger.error(message);
  }

  fatal(message: any): void {
    this.logger.fatal(message);
  }

  setLogConfigLevel(level: LogConfigLevel): void {
    if (this.logger.levels[level] !== undefined) {
      this.logger.level = level;
    } else {
      throw new Error(`Unsupported log config level: ${level}`);
    }
  }

  silent(): void {
    this.logger.silent = true;
  }
}

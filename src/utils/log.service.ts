import winston from "winston";
import type { LoggerModuleInterface } from "./log";
import { SUPPORTED_LOG_LEVELS } from "./log";

const { combine, timestamp, printf, splat } = winston.format;

export type LoggerModule = winston.Logger &
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
    fatal: "redBG",
    error: "red",
    warn: "yellow",
    info: "blue",
    debug: "green",
  },
};

export const logFormat = printf((info) => {
  info.level = info.level.toUpperCase();
  const transformedInfo = winston.format.colorize().transform(info, {
    level: true,
  }) as winston.Logform.TransformableInfo;

  if (!transformedInfo) {
    return "";
  }

  return `[${transformedInfo.timestamp}] ${transformedInfo.level}: ${transformedInfo.message}`;
});
export class WinstonLoggerService implements LoggerModuleInterface {
  private logger: LoggerModule;
  constructor(private logLevel: string = "info") {
    this.logger = winston.createLogger({
      level: "info",
      levels: logLevels.levels,
      transports: [
        new winston.transports.Console({
          format: combine(timestamp(), splat(), logFormat),
          stderrLevels: SUPPORTED_LOG_LEVELS,
        }),
      ],
    }) as LoggerModule;

    winston.addColors(logLevels.colors);
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

  setLoggerLevel(level: string): void {
    if (this.logger.levels[level] !== undefined) {
      this.logger.level = level;
    } else {
      throw new Error(`Unsupported log level: ${level}`);
    }
  }
}

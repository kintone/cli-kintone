import winston from "winston";

const { combine, timestamp, printf, splat } = winston.format;

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
export type Logger = winston.Logger &
  Record<keyof typeof logLevels.levels, winston.LeveledLogMethod>;
export const SUPPORTED_LOG_LEVELS: LogLevel[] = [
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
];

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

winston.addColors(logLevels.colors);
export const logger = winston.createLogger({
  level: "info",
  levels: logLevels.levels,
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), splat(), logFormat),
      stderrLevels: SUPPORTED_LOG_LEVELS,
    }),
  ],
}) as Logger;

export const setLogLevel = (level: LogLevel) => {
  if (logger.levels[level] !== undefined) {
    logger.level = level;
  } else {
    throw new Error(`Unsupported log level: ${level}`);
  }
};

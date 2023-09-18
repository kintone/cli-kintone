import type { Arguments, Options } from "yargs";
import type { LogConfigLevel } from "../../utils/log";
import { logger, SUPPORTED_LOG_CONFIG_LEVELS } from "../../utils/log";

export const logOptions: { [key: string]: Options } = {
  "log-level": {
    describe: "Log config level",
    default: "info",
    choices: SUPPORTED_LOG_CONFIG_LEVELS,
    requiresArg: true,
  },
  verbose: {
    describe: "Verbose mode",
    type: "boolean",
  },
};

type LogArguments = Arguments & {
  verbose?: boolean;
  "log-level"?: LogConfigLevel;
};

export const logHandler = (args: LogArguments) => {
  const verbose = args.verbose;
  if (verbose) {
    logger.setLogConfigLevel("debug");
    return;
  }

  const logLevel = args["log-level"] as LogConfigLevel;

  logger.setLogConfigLevel(logLevel);
};

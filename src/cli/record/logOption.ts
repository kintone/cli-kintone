import type { Options, Arguments } from "yargs";
import type { LogConfigLevel } from "../../utils/log";
import { logger, SUPPORTED_LOG_CONFIG_LEVELS } from "../../utils/log";

export const logOptions: { [key: string]: Options } = {
  "log-level": {
    describe: "Log Level",
    default: "info",
    choices: SUPPORTED_LOG_CONFIG_LEVELS,
    requiresArg: true,
  },
  verbose: {
    alias: "v",
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

  if (!args["log-level"]) {
    throw new Error("log-level is required");
  }

  const logLevel = args["log-level"];

  logger.setLogConfigLevel(logLevel);
};

import type { Options } from "yargs";
import { SUPPORTED_LOG_LEVELS } from "../../utils/log";

export const CommonOptions: { [key: string]: Options } = {
  logLevel: {
    describe: "Log Level",
    default: "info",
    choices: SUPPORTED_LOG_LEVELS,
    requiresArg: true,
  },
  logLevel1: {
    describe: "Log Level",
    default: "info",
    choices: SUPPORTED_LOG_LEVELS,
    requiresArg: true,
  },
};

export const helper: any = (keys: string[]) => {
  const obj: { [key: string]: {} } = {};
  keys.forEach((key) => {
    obj[key] = CommonOptions[key];
  });

  return obj;
};

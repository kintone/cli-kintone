import type { AuthModule } from "./types";
import type yargs from "yargs";

type OptionsDefinition = Parameters<yargs.Argv["options"]>[0];

const options = {
  "api-token": {
    describe: "App's API token",
    default: process.env.KINTONE_API_TOKEN,
    defaultDescription: "KINTONE_API_TOKEN",
    type: "array",
    string: true,
    requiresArg: true,
  },
} satisfies OptionsDefinition;

export const apiTokenAuth = {
  label: "API token",
  priority: 1,
  options,
  hiddenOptions: {
    "api-token": { ...options["api-token"], hidden: true },
  },
  check: (argv) => {
    const apiToken = argv["api-token"];
    if (!apiToken) {
      return false;
    }
    if (Array.isArray(apiToken)) {
      return apiToken.some(Boolean);
    }
    return !!apiToken;
  },
  clear: (argv) => {
    argv["api-token"] = undefined;
  },
} satisfies AuthModule;

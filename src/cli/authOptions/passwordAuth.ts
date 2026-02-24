import type { AuthModule } from "./types";
import type yargs from "yargs";

type OptionsDefinition = Parameters<yargs.Argv["options"]>[0];

const options = {
  username: {
    alias: "u",
    describe: "Kintone Username",
    default: process.env.KINTONE_USERNAME,
    defaultDescription: "KINTONE_USERNAME",
    type: "string",
    requiresArg: true,
  },
  password: {
    alias: "p",
    describe: "Kintone Password",
    default: process.env.KINTONE_PASSWORD,
    defaultDescription: "KINTONE_PASSWORD",
    type: "string",
    requiresArg: true,
  },
} satisfies OptionsDefinition;

export const passwordAuth = {
  label: "login",
  priority: 0,
  options,
  hiddenOptions: {
    username: { ...options.username, hidden: true },
    password: { ...options.password, hidden: true },
  },
  check: (argv) => !!argv.username && !!argv.password,
  clear: (argv) => {
    argv.username = undefined;
    argv.password = undefined;
  },
} satisfies AuthModule;

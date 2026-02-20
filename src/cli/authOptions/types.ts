import type yargs from "yargs";

type OptionsDefinition = Parameters<yargs.Argv["options"]>[0];

export type AuthArgv = Record<string, unknown>;

export type AuthModule = {
  label: string;
  /** Lower number = higher priority */
  priority: number;
  options: OptionsDefinition;
  hiddenOptions: OptionsDefinition;
  check: (argv: AuthArgv) => boolean;
  clear: (argv: AuthArgv) => void;
};

/** Resolved argv types for auth options after yargs parsing */
export type AuthResolvedArgv = {
  username: string | undefined;
  password: string | undefined;
  "api-token": string[] | undefined;
};

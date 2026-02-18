import type yargs from "yargs";

import {
  type AuthMethod,
  type AuthArgv,
  type AuthResolvedArgv,
  authModules,
  checkAuth,
  resolveAuthPriority,
} from "./authOptions";

type OptionsDefinition = Parameters<yargs.Argv["options"]>[0];

const connectionOptions = {
  "base-url": {
    describe: "Kintone Base Url",
    default: process.env.KINTONE_BASE_URL,
    defaultDescription: "KINTONE_BASE_URL",
    type: "string",
    demandOption: true,
    requiresArg: true,
  },
  "basic-auth-username": {
    describe: "Kintone Basic Auth Username",
    default: process.env.KINTONE_BASIC_AUTH_USERNAME,
    defaultDescription: "KINTONE_BASIC_AUTH_USERNAME",
    type: "string",
    requiresArg: true,
  },
  "basic-auth-password": {
    describe: "Kintone Basic Auth Password",
    default: process.env.KINTONE_BASIC_AUTH_PASSWORD,
    defaultDescription: "KINTONE_BASIC_AUTH_PASSWORD",
    type: "string",
    requiresArg: true,
  },
  "pfx-file-path": {
    describe: "The path to client certificate file",
    type: "string",
    requiresArg: true,
  },
  "pfx-file-password": {
    describe: "The password of client certificate file",
    type: "string",
    requiresArg: true,
  },
  proxy: {
    describe: "The URL of a proxy server",
    default: process.env.HTTPS_PROXY ?? process.env.https_proxy,
    defaultDescription: "HTTPS_PROXY",
    type: "string",
  },
} satisfies OptionsDefinition;

const guestSpaceOptions = {
  "guest-space-id": {
    describe: "The ID of guest space",
    default: process.env.KINTONE_GUEST_SPACE_ID,
    defaultDescription: "KINTONE_GUEST_SPACE_ID",
    type: "string",
    requiresArg: true,
  },
} satisfies OptionsDefinition;

export const buildConnectionOptions = (
  args: yargs.Argv,
  config: {
    auth: readonly [AuthMethod, ...AuthMethod[]];
    guestSpace?: boolean;
  },
) => {
  // NOTE: Calling .options() in a loop breaks yargs type inference, so we use AuthResolvedArgv to supplement the auth argv types.
  let builder = args.options(connectionOptions) as yargs.Argv<
    yargs.InferredOptionTypes<typeof connectionOptions> & AuthResolvedArgv
  >;

  for (const [method, module] of Object.entries(authModules)) {
    builder = builder.options(
      config.auth.includes(method as AuthMethod)
        ? module.options
        : module.hiddenOptions,
    );
  }

  const checked = builder
    .options(
      config.guestSpace
        ? guestSpaceOptions
        : {
            "guest-space-id": {
              ...guestSpaceOptions["guest-space-id"],
              hidden: true,
            },
          },
    )
    .check((a: AuthArgv): true => checkAuth(config.auth, a));

  if (config.auth.length > 1) {
    return checked.middleware((a: AuthArgv): void =>
      resolveAuthPriority(config.auth, a),
    );
  }
  return checked;
};

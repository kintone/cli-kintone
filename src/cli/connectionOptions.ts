import type yargs from "yargs";

type OptionsDefinition = Parameters<yargs.Argv["options"]>[0];

/**
 * Connection and authentication base options (used by all remote commands)
 * ref. https://cli.kintone.dev/guide/options
 */
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

const passwordAuthOptions = {
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

const apiTokenAuthOptions = {
  "api-token": {
    describe: "App's API token",
    default: process.env.KINTONE_API_TOKEN,
    defaultDescription: "KINTONE_API_TOKEN",
    type: "array",
    string: true,
    requiresArg: true,
  },
} satisfies OptionsDefinition;

/**
 * Guest space options
 */
export const guestSpaceOptions = {
  "guest-space-id": {
    describe: "The ID of guest space",
    default: process.env.KINTONE_GUEST_SPACE_ID,
    defaultDescription: "KINTONE_GUEST_SPACE_ID",
    type: "string",
    requiresArg: true,
  },
} satisfies OptionsDefinition;

const hasPasswordAuth = (argv: {
  username?: string;
  password?: string;
}): boolean => {
  return !!argv.username && !!argv.password;
};

const hasApiTokenAuth = (argv: {
  "api-token"?: string | string[];
}): boolean => {
  const apiToken = argv["api-token"];
  if (!apiToken) {
    return false;
  }
  if (typeof apiToken === "string") {
    return !!apiToken;
  }
  return apiToken.filter(Boolean).length > 0;
};

/**
 * Connection + password authentication options with validation.
 * Username and password are required.
 */
export const withPasswordAuth = (args: yargs.Argv) => {
  return args
    .options(connectionOptions)
    .options(passwordAuthOptions)
    .check((argv) => {
      if (!argv.username && !argv.password) {
        throw new Error(
          "Username and password are required (--username or KINTONE_USERNAME, --password or KINTONE_PASSWORD)",
        );
      }
      if (!argv.username) {
        throw new Error(
          "Username is required (--username or KINTONE_USERNAME)",
        );
      }
      if (!argv.password) {
        throw new Error(
          "Password is required (--password or KINTONE_PASSWORD)",
        );
      }
      return true;
    });
};

/**
 * Connection + API token authentication options with validation.
 * API token is required.
 */
export const withApiTokenAuth = (args: yargs.Argv) => {
  return args
    .options(connectionOptions)
    .options(apiTokenAuthOptions)
    .check((argv) => {
      if (!hasApiTokenAuth(argv)) {
        throw new Error(
          "API token is required (--api-token or KINTONE_API_TOKEN)",
        );
      }
      return true;
    });
};

/**
 * Connection + both authentication options with validation.
 * Either (username AND password) or API token is required.
 * When both are provided, password auth takes priority (api-token is cleared).
 */
export const withEitherAuth = (args: yargs.Argv) => {
  return args
    .options(connectionOptions)
    .options(passwordAuthOptions)
    .options(apiTokenAuthOptions)
    .check((argv) => {
      if (!hasPasswordAuth(argv) && !hasApiTokenAuth(argv)) {
        if (argv.username) {
          throw new Error(
            "Password is required (--password or KINTONE_PASSWORD)",
          );
        }
        throw new Error(
          "Either username (--username) or API token (--api-token) is required",
        );
      }
      return true;
    })
    .middleware((argv) => {
      // Password auth takes priority over API token auth
      if (hasPasswordAuth(argv) && hasApiTokenAuth(argv)) {
        argv["api-token"] = undefined;
      }
    });
};

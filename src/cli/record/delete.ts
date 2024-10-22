import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { run } from "../../record/delete";
import type { SupportedImportEncoding } from "../../utils/file";
import { logger } from "../../utils/log";
import { confirm } from "@inquirer/prompts";

const command = "delete";

const describe = "delete the records of the specified app";

const encoding: SupportedImportEncoding[] = ["utf8", "sjis"];

const FORCE_DELETE_KEY = "yes";
const FORCE_DELETE_ALIAS = "y";

const builder = (args: yargs.Argv) =>
  args
    .option("base-url", {
      describe: "Kintone Base Url",
      default: process.env.KINTONE_BASE_URL,
      defaultDescription: "KINTONE_BASE_URL",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("username", {
      alias: "u",
      describe: "*Invalid* Kintone Username",
      default: process.env.KINTONE_USERNAME,
      defaultDescription: "KINTONE_USERNAME",
      hidden: true,
    })
    .option("password", {
      alias: "p",
      describe: "*Invalid* Kintone Password",
      default: process.env.KINTONE_PASSWORD,
      defaultDescription: "KINTONE_PASSWORD",
      hidden: true,
    })
    .option("api-token", {
      describe: "App's API token",
      default: process.env.KINTONE_API_TOKEN,
      defaultDescription: "KINTONE_API_TOKEN",
      type: "array",
      string: true,
      requiresArg: true,
    })
    .option("basic-auth-username", {
      describe: "Kintone Basic Auth Username",
      default: process.env.KINTONE_BASIC_AUTH_USERNAME,
      defaultDescription: "KINTONE_BASIC_AUTH_USERNAME",
      type: "string",
      requiresArg: true,
    })
    .option("basic-auth-password", {
      describe: "Kintone Basic Auth Password",
      default: process.env.KINTONE_BASIC_AUTH_PASSWORD,
      defaultDescription: "KINTONE_BASIC_AUTH_PASSWORD",
      type: "string",
      requiresArg: true,
    })
    .option("app", {
      describe: "The ID of the app",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("guest-space-id", {
      describe: "The ID of guest space",
      default: process.env.KINTONE_GUEST_SPACE_ID,
      defaultDescription: "KINTONE_GUEST_SPACE_ID",
      type: "string",
      requiresArg: true,
    })
    .option("pfx-file-path", {
      describe: "The path to client certificate file",
      type: "string",
      requiresArg: true,
    })
    .option("pfx-file-password", {
      describe: "The password of client certificate file",
      type: "string",
      requiresArg: true,
    })
    .option("proxy", {
      describe: "The URL of a proxy server",
      default: process.env.HTTPS_PROXY ?? process.env.https_proxy,
      defaultDescription: "HTTPS_PROXY",
      type: "string",
    })
    .option(FORCE_DELETE_KEY, {
      alias: FORCE_DELETE_ALIAS,
      describe: "Force to delete records",
      type: "boolean",
    })
    .option("file-path", {
      describe: "The path to the CSV file",
      type: "string",
      requiresArg: true,
    })
    .option("encoding", {
      describe: "Character encoding",
      default: "utf8" as SupportedImportEncoding,
      choices: encoding,
      requiresArg: true,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const execute = (args: Args) => {
  return run({
    baseUrl: args["base-url"],
    apiToken: args["api-token"],
    basicAuthUsername: args["basic-auth-username"],
    basicAuthPassword: args["basic-auth-password"],
    app: args.app,
    guestSpaceId: args["guest-space-id"],
    pfxFilePath: args["pfx-file-path"],
    pfxFilePassword: args["pfx-file-password"],
    httpsProxy: args.proxy,
    filePath: args["file-path"],
    encoding: args.encoding,
  });
};

const handler = async (args: Args) => {
  if (!hasApiToken(args["api-token"]) && (args.username || args.password)) {
    logger.error("The delete command only supports API token authentication.");
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }

  if (args.yes !== undefined && args.yes) {
    return execute(args);
  }

  const answers = await confirm({
    message: `Are you sure want to delete ${
      args["file-path"] ? "" : "all "
    }records?`,
    default: false,
  });
  if (answers) {
    return execute(args);
  }

  return undefined;
};

const hasApiToken = (apiTokenArg?: string | string[]): boolean => {
  if (!apiTokenArg) {
    return false;
  }

  if (typeof apiTokenArg === "string") {
    return !!apiTokenArg;
  }

  return apiTokenArg.filter(Boolean).length > 0;
};

export const deleteCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

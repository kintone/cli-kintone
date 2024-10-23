import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { run } from "../../record/delete";
import type { SupportedImportEncoding } from "../../utils/file";
import { logger } from "../../utils/log";
import { confirm } from "@inquirer/prompts";
import { commonOptions } from "../commonOptions";

const command = "delete";

const describe = "delete the records of the specified app";

const encoding: SupportedImportEncoding[] = ["utf8", "sjis"];

const FORCE_DELETE_KEY = "yes";
const FORCE_DELETE_ALIAS = "y";

const builder = (args: yargs.Argv) =>
  args
    .options(commonOptions)
    // NOTE: record delete command only accepts API token authn.
    .hide("username")
    .hide("password")
    .option("app", {
      describe: "The ID of the app",
      type: "string",
      demandOption: true,
      requiresArg: true,
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

import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { run } from "../../record/delete";
import inquirer from "inquirer";
import type { Question } from "inquirer";
import type { SupportedImportEncoding } from "../../utils/file";

const command = "delete";

const describe = "delete all records";

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
    .option("api-token", {
      describe: "App's API token",
      default: process.env.KINTONE_API_TOKEN,
      defaultDescription: "KINTONE_API_TOKEN",
      type: "array",
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
  if (args.yes !== undefined && args.yes) {
    return execute(args);
  }

  const prompt = inquirer.createPromptModule();
  const questions: Question[] = [
    {
      name: FORCE_DELETE_KEY,
      type: "confirm",
      message: "Are you sure want to delete records?",
      default: true,
    },
  ];

  const answers = await prompt(questions);
  if (answers[FORCE_DELETE_KEY]) {
    return execute(args);
  }

  return undefined;
};

export const deleteCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

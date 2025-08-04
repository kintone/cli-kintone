import type yargs from "yargs";
import { run } from "../../record/import";
import type { SupportedImportEncoding } from "../../utils/file";
import type { CommandModule } from "yargs";
import { commonOptions } from "../commonOptions";

const command = "import";

const describe = "import the records of the specified app";

const encoding: SupportedImportEncoding[] = ["utf8", "sjis"];

const builder = (args: yargs.Argv) =>
  args
    .options(commonOptions)
    .option("app", {
      describe: "The ID of the app",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("attachments-dir", {
      describe: "Attachment file directory",
      type: "string",
      requiresArg: true,
    })
    .option("file-path", {
      describe: 'The path to source file.\nThe file extension should be ".csv"',
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("encoding", {
      describe: "Character encoding",
      default: "utf8" as SupportedImportEncoding,
      choices: encoding,
      requiresArg: true,
    })
    .option("update-key", {
      describe: "The key to Bulk Update",
      type: "string",
      requiresArg: true,
    })
    .option("fields", {
      describe: "The fields to be imported in comma-separated",
      type: "string",
      requiresArg: true,
    })
    .option("experimental-use-server-side-upsert", {
      describe:
        "Use server-side upsert. This option is under early development.",
      type: "boolean",
      hidden: true,
      default: false,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = (args: Args) => {
  return run({
    baseUrl: args["base-url"],
    username: args.username,
    password: args.password,
    apiToken: args["api-token"],
    basicAuthUsername: args["basic-auth-username"],
    basicAuthPassword: args["basic-auth-password"],
    app: args.app,
    guestSpaceId: args["guest-space-id"],
    attachmentsDir: args["attachments-dir"],
    filePath: args["file-path"],
    updateKey: args["update-key"],
    fields: args.fields?.split(","),
    useServerSideUpsert: args["experimental-use-server-side-upsert"],
    encoding: args.encoding,
    pfxFilePath: args["pfx-file-path"],
    pfxFilePassword: args["pfx-file-password"],
    httpsProxy: args.proxy,
  });
};

export const importCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

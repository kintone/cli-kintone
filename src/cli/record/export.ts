import type yargs from "yargs";
import type { CommandModule } from "yargs";
import type { ExportFileEncoding } from "../../record/export";
import { run } from "../../record/export";
import { commonOptions } from "../commonOptions";

const encodings: ExportFileEncoding[] = ["utf8", "sjis"];

const command = "export";

const describe = "export the records of the specified app";

const builder = (args: yargs.Argv) =>
  args
    .options(commonOptions)
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
    .option("attachments-dir", {
      describe: "Attachment file directory",
      type: "string",
      requiresArg: true,
    })
    .option("encoding", {
      describe: "Character encoding",
      default: "utf8" as ExportFileEncoding,
      choices: encodings,
      requiresArg: true,
    })
    .option("condition", {
      alias: "c",
      describe: "The query string",
      type: "string",
      requiresArg: true,
    })
    .option("order-by", {
      description: "The sort order as a query",
      type: "string",
      requiresArg: true,
    })
    .option("fields", {
      describe: "The fields to be exported in comma-separated",
      type: "string",
      requiresArg: true,
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
    encoding: args.encoding,
    condition: args.condition,
    orderBy: args["order-by"],
    fields: args.fields?.split(","),
    pfxFilePath: args["pfx-file-path"],
    pfxFilePassword: args["pfx-file-password"],
    httpsProxy: args.proxy,
  });
};

export const exportCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { buildConnectionOptions } from "../connectionOptions";
import { run } from "../../plugin/upload";

const command = "upload";

const describe = "Upload a plugin to kintone";

const builder = (args: yargs.Argv) =>
  buildConnectionOptions(args, { auth: ["password"] })
    .option("input", {
      alias: "i",
      describe: "The input plugin zip",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("yes", {
      alias: "y",
      describe: "Skip confirmation",
      type: "boolean",
      default: false,
    })
    .option("watch", {
      describe: "Run in watch mode",
      type: "boolean",
      default: false,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  await run({
    baseUrl: args["base-url"],
    username: args.username,
    password: args.password,
    basicAuthUsername: args["basic-auth-username"],
    basicAuthPassword: args["basic-auth-password"],
    // The option is hidden for this command, but it still changes the endpoint of the file upload.
    guestSpaceId: args["guest-space-id"],
    pfxFilePath: args["pfx-file-path"],
    pfxFilePassword: args["pfx-file-password"],
    httpsProxy: args.proxy,
    input: args.input,
    yes: args.yes,
    watch: args.watch,
  });
};

export const uploadCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

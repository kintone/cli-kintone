import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { buildConnectionOptions } from "../connectionOptions";
import type { Params } from "../../plugin/upload";
import { upload } from "../../plugin/upload";
import type { RestAPIClientOptions } from "../../kintone/client";

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
  try {
    const params: Params = {
      ...args,
      pluginFilePath: args.input,
      force: args.yes,
      watch: args.watch,
    };
    const apiClientOptions: RestAPIClientOptions = {
      baseUrl: args["base-url"],
      username: args.username,
      password: args.password,
      basicAuthUsername: args["basic-auth-username"],
      basicAuthPassword: args["basic-auth-password"],
      pfxFilePath: args["pfx-file-path"],
      pfxFilePassword: args["pfx-file-password"],
      httpsProxy: args.proxy,
    };
    await upload({ ...params, ...apiClientOptions });
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const uploadCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

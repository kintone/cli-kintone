import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { withPasswordAuth, guestSpaceOptions } from "../connectionOptions";
import { runExport } from "../../customize/export";

const command = "export";

const describe =
  "Export JavaScript/CSS customization settings from a kintone app";

const builder = (args: yargs.Argv) =>
  withPasswordAuth(args)
    .options(guestSpaceOptions)
    .option("app", {
      describe: "The kintone app ID",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("output", {
      alias: "o",
      describe: "The output path for customize-manifest.json",
      type: "string",
      default: "customize-manifest.json",
      requiresArg: true,
    })
    .option("yes", {
      alias: "y",
      describe: "Skip confirmation prompts",
      type: "boolean",
      default: false,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  try {
    await runExport({
      appId: args.app,
      outputPath: args.output,
      yes: args.yes,
      baseUrl: args["base-url"],
      username: args.username,
      password: args.password,
      basicAuthUsername: args["basic-auth-username"],
      basicAuthPassword: args["basic-auth-password"],
      guestSpaceId: args["guest-space-id"],
      pfxFilePath: args["pfx-file-path"],
      pfxFilePassword: args["pfx-file-password"],
      httpsProxy: args.proxy,
    });
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const exportCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

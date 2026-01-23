import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { commonOptions } from "../commonOptions";
import { runApply } from "../../customize/apply";

const command = "apply";

const describe = "Apply JavaScript/CSS customization to a kintone app";

const builder = (args: yargs.Argv) =>
  args
    .options(commonOptions)
    // NOTE: This command only supports password authn.
    .hide("api-token")
    .option("input", {
      alias: "i",
      describe: "The path to customize-manifest.json",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("app", {
      alias: "a",
      describe: "The kintone app ID",
      type: "string",
      demandOption: true,
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
    await runApply({
      appId: args.app,
      inputPath: args.input,
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

export const applyCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

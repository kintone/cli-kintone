import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { commonOptions } from "../commonOptions";
import { runExport } from "../../customize/export";

const command = "export";

const describe =
  "Export JavaScript/CSS customization settings from a kintone app";

const builder = (args: yargs.Argv) =>
  args
    .options(commonOptions)
    // NOTE: This command only supports password authn.
    .hide("api-token")
    .option("app", {
      alias: "a",
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
    const guestSpaceId = args["guest-space-id"]
      ? parseInt(args["guest-space-id"], 10)
      : 0;

    await runExport({
      appId: args.app,
      outputPath: args.output,
      yes: args.yes,
      baseUrl: args["base-url"],
      username: args.username ?? null,
      password: args.password ?? null,
      oAuthToken: null,
      basicAuthUsername: args["basic-auth-username"] ?? null,
      basicAuthPassword: args["basic-auth-password"] ?? null,
      options: {
        proxy: args.proxy ?? "",
        guestSpaceId,
      },
    });
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const exportCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);

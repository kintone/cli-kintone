import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { commonOptions } from "../commonOptions";
import { run } from "../../customize/upload";

const command = "upload <manifest-file>";

const describe = "Upload JavaScript/CSS customization to a kintone app";

const builder = (args: yargs.Argv) =>
  args
    .positional("manifest-file", {
      describe: "The path to customize-manifest.json",
      type: "string",
      demandOption: true,
    })
    .options(commonOptions)
    // NOTE: This command only supports password authn.
    .hide("api-token")
    .option("watch", {
      alias: "w",
      describe: "Watch for file changes and re-upload",
      type: "boolean",
      default: false,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  try {
    // Language is fixed to "en"
    const lang = "en" as const;

    const guestSpaceId = args["guest-space-id"]
      ? parseInt(args["guest-space-id"], 10)
      : 0;

    await run({
      baseUrl: args["base-url"],
      username: args.username ?? null,
      password: args.password ?? null,
      oAuthToken: null,
      basicAuthUsername: args["basic-auth-username"] ?? null,
      basicAuthPassword: args["basic-auth-password"] ?? null,
      manifestFile: args["manifest-file"],
      options: {
        lang,
        proxy: args.proxy ?? "",
        guestSpaceId,
        watch: args.watch ? "true" : undefined,
      },
    });
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const uploadCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);

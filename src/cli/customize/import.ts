import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { commonOptions } from "../commonOptions";
import { runImport } from "../../customize/import";

const command = "import <manifest-file>";

const describe =
  "Import JavaScript/CSS customization settings from a kintone app";

const builder = (args: yargs.Argv) =>
  args
    .positional("manifest-file", {
      describe:
        "The path to a manifest file containing the app ID (minimal format: { app: '<app-id>' })",
      type: "string",
      demandOption: true,
    })
    .options(commonOptions)
    // NOTE: This command only supports password authn.
    .hide("api-token")
    .option("dest-dir", {
      describe: "The destination directory for downloaded files",
      type: "string",
      default: ".",
      requiresArg: true,
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

    await runImport({
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
        destDir: args["dest-dir"],
      },
    });
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const importCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);

import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { runInit } from "../../customize/init";
import { promptForScope } from "../../customize/init/prompts";
import { getBoundMessage } from "../../customize/core";

const command = "init";

const describe = "Initialize a customize-manifest.json file";

const builder = (args: yargs.Argv) =>
  args
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
    // Language is fixed to "en"
    const lang = "en" as const;
    const m = getBoundMessage(lang);

    // Prompt for scope
    const scope = (await promptForScope(m)) as "ALL" | "ADMIN" | "NONE";

    await runInit({
      scope,
      outputPath: args.output,
      yes: args.yes,
    });
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const initCommand: CommandModule<{}, Args> = setStability(
  {
    command,
    describe,
    builder,
    handler,
  },
  "experimental",
  "This feature is under early development",
);

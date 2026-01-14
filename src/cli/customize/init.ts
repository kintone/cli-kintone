import type yargs from "yargs";
import type { CommandModule } from "yargs";
import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import { runInit } from "../../customize/init";
import {
  promptForAppId,
  promptForScope,
} from "../../customize/upload/prompts/init";
import { getBoundMessage } from "../../customize/core";

const command = "init";

const describe = "Initialize a customize-manifest.json file";

const builder = (args: yargs.Argv) =>
  args
    .option("app-id", {
      describe: "The kintone app ID",
      type: "string",
      requiresArg: true,
    })
    .option("scope", {
      describe: "The scope of the customization",
      type: "string",
      choices: ["ALL", "ADMIN", "NONE"] as const,
      requiresArg: true,
    })
    .option("dest-dir", {
      describe: "The destination directory for customize-manifest.json",
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
    const m = getBoundMessage(lang);

    // Prompt for app ID if not provided
    const appId = args["app-id"] ?? (await promptForAppId(m));

    // Prompt for scope if not provided
    const scope =
      args.scope ?? ((await promptForScope(m)) as "ALL" | "ADMIN" | "NONE");

    await runInit(appId, scope, lang, args["dest-dir"]);
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

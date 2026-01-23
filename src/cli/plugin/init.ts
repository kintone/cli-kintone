import type yargs from "yargs";
import type { CommandModule } from "yargs";

import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { run } from "../../plugin/init";

const command = "init";

const describe = "Initialize plugin project";

const builder = (args: yargs.Argv) =>
  args
    .option("name", {
      describe:
        "The name of your plugin (and the target directory). If omitted, you will be prompted to input interactively.",
      type: "string",
      requiresArg: true,
    })
    .option("template", {
      describe:
        "A template for a generated plug-in. See https://github.com/kintone/cli-kintone/tree/main/plugin-templates for available templates",
      type: "string",
      default: "javascript",
      requiresArg: true,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  try {
    const flags = {
      name: args.name,
      template: args.template,
    };
    if (process.env.NODE_ENV === "test") {
      console.log(JSON.stringify({ flags: flags }));
    } else {
      await run(flags);
    }
  } catch (error) {
    logger.error(new RunError(error));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

export const initCommand: CommandModule<{}, Args> = {
  command,
  describe,
  builder,
  handler,
};

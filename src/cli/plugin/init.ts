import type yargs from "yargs";
import type { CommandModule } from "yargs";

import { logger } from "../../utils/log";
import { RunError } from "../../record/error";
import { setStability } from "../stability";
import type { TemplateType } from "../../plugin/init/utils/template";
import { SUPPORT_TEMPLATE_TYPE } from "../../plugin/init/utils/template";
import { run } from "../../plugin/init";

const command = "init";

const describe = "Initialize plugin project";

const builder = (args: yargs.Argv) =>
  args
    .option("name", {
      describe: "The name of your plugin",
      type: "string",
      demandOption: true,
      requiresArg: true,
    })
    .option("template", {
      describe: "A template for a generated plug-in",
      type: "string",
      default: "javascript",
      choices: SUPPORT_TEMPLATE_TYPE,
      requiresArg: true,
    });

type Args = yargs.Arguments<
  ReturnType<typeof builder> extends yargs.Argv<infer U> ? U : never
>;

const handler = async (args: Args) => {
  try {
    const flags = {
      name: args.name,
      template: args.template as TemplateType,
    };
    if (process.env.NODE_ENV === "test") {
      console.log(JSON.stringify({ flags: flags }));
    } else {
      run(flags);
    }
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

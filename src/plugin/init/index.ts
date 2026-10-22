import { initPlugin } from "./usecases/init";
import {
  PluginDirectoryExistsError,
  PluginProjectCreationError,
} from "./usecases/init/error";
import { LocalPluginProjectRepositoryFromTemplate } from "./repositories/localPluginProjectRepositoryFromTemplate";
import { getMessage } from "./utils/messages";
import { runPrompt } from "./utils/qa";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

type Options = {
  name: string | undefined;
  template: string;
};

// Keeps the CLI output of init; RunError prints the heading and the cause on separate lines with the "Error: " prefix.
const buildErrorOutput = (e: unknown) => {
  if (e instanceof PluginDirectoryExistsError) {
    return `${e.cause}`;
  }
  if (e instanceof PluginProjectCreationError) {
    const reason = e.cause instanceof Error ? e.cause.message : String(e.cause);
    return `${e.message} Error:${reason}`;
  }
  return new RunError(e);
};

export const run: (argv: Options) => Promise<void> = async (argv) => {
  try {
    logger.info(`

  ${getMessage("introduction")}

  `);
    const answers = await runPrompt(argv.name);
    const project = new LocalPluginProjectRepositoryFromTemplate({
      directory: answers.projectName,
      templateName: argv.template,
    });
    await initPlugin(answers, project);
  } catch (e) {
    logger.error(buildErrorOutput(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

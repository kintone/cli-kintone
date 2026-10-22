import { initPlugin } from "./usecases/init";
import {
  PluginDirectoryExistsError,
  PluginProjectCreationError,
} from "./usecases/init/error";
import { runPrompt } from "./utils/qa";
import { setupTemplate } from "./utils/template";
import { installDependencies } from "./utils/deps";
import { runKeygen } from "./utils/keygen";
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
    await initPlugin(
      { name: argv.name, template: argv.template },
      { runPrompt, setupTemplate, installDependencies, runKeygen },
    );
  } catch (e) {
    logger.error(buildErrorOutput(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

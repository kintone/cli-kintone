import { initPlugin } from "./usecases/init";
import { LocalPluginProjectRepositoryFromTemplate } from "./repositories/localPluginProjectRepositoryFromTemplate";
import { getMessage } from "./utils/messages";
import { runPrompt } from "./utils/qa";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

type Options = {
  name: string | undefined;
  template: string;
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
    logger.error(new RunError(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

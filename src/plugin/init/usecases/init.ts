import chalk from "chalk";
import type { Lang } from "../utils/lang";
import { getBoundMessage } from "../utils/messages";
import type { setupTemplate } from "../utils/template";
import type { runPrompt } from "../utils/qa";
import { logger } from "../../../utils/log";
import path from "path";
import fs from "fs";
import type { installDependencies } from "../utils/deps";
import type { runKeygen } from "../utils/keygen";
import { isDirectory } from "../../../utils/file";
import {
  PluginDirectoryExistsError,
  PluginProjectCreationError,
} from "./init/error";

const getSuccessCreatedPluginMessage = (
  packageName: string,
  outputDir: string,
  lang: Lang,
) => {
  const m = getBoundMessage(lang);
  return `

Success! Created ${packageName} at ${outputDir}

${chalk.cyan("npm start")}

  ${m("npmStart")}

${chalk.cyan("npm run build")}

  ${m("npmBuild")}

${chalk.cyan("npm run lint")}

  ${m("npmLint")}

${m("nextAction")}

  cd ${outputDir}
  npm start

${m("lastMessage")}
${m("developerSite")}

      `;
};

type InitPluginOptions = {
  /** project name passed by CLI argument (undefined if not specified) */
  name?: string;
  lang: Lang;
  template: string;
};

export interface InitPluginSteps {
  readonly runPrompt: typeof runPrompt;
  readonly setupTemplate: typeof setupTemplate;
  readonly installDependencies: typeof installDependencies;
  readonly runKeygen: typeof runKeygen;
}

/**
 * Run create-kintone-plugin script
 */
export const initPlugin = async (
  options: InitPluginOptions,
  steps: InitPluginSteps,
): Promise<void> => {
  const m = getBoundMessage(options.lang);
  logger.info(`

  ${m("introduction")}

  `);

  const answers = await steps.runPrompt(m, options.name);

  const packageName = path.basename(answers.projectName);
  logger.info(m("settingUpTemplate"));
  logger.debug(`template: ${options.template}`);

  // Verify output directory does not exist
  const directoryExists = await isDirectory(answers.projectName);
  if (directoryExists) {
    throw new PluginDirectoryExistsError(answers.projectName);
  }

  try {
    await steps.setupTemplate({
      outputDir: answers.projectName,
      templateName: options.template,
      manifestPatch: {
        name: answers.name,
        description: answers.description,
        homepage_url: answers.homepage_url,
      },
      packageJsonPatch: {
        name: packageName,
      },
    });
    logger.info(m("templateSetupCompleted"));
    steps.installDependencies(answers.projectName, options.lang);
    steps.runKeygen(answers.projectName, options.lang);
    logger.info(
      getSuccessCreatedPluginMessage(
        packageName,
        answers.projectName,
        options.lang,
      ),
    );
  } catch (error) {
    await fs.promises
      .rm(answers.projectName, { recursive: true, force: true })
      .catch((removeError: unknown) => {
        logger.debug(
          `failed to remove ${answers.projectName}: ${String(removeError)}`,
        );
      });
    throw new PluginProjectCreationError(error);
  }
};

import chalk from "chalk";
import path from "path";
import { getMessage } from "../utils/messages";
import type { Answers } from "../utils/qa";
import { logger } from "../../../utils/log";
import type { LocalPluginProjectRepository } from "./interface";
import {
  PluginDirectoryExistsError,
  PluginProjectCreationError,
} from "./init/error";

const getSuccessCreatedPluginMessage = (
  packageName: string,
  outputDir: string,
) => `

Success! Created ${packageName} at ${outputDir}

${chalk.cyan("npm start")}

  ${getMessage("npmStart")}

${chalk.cyan("npm run build")}

  ${getMessage("npmBuild")}

${chalk.cyan("npm run lint")}

  ${getMessage("npmLint")}

${getMessage("nextAction")}

  cd ${outputDir}
  npm start

${getMessage("lastMessage")}


      `;

export const initPlugin = async (
  answers: Answers,
  project: LocalPluginProjectRepository,
): Promise<void> => {
  const packageName = path.basename(answers.projectName);
  logger.info(getMessage("settingUpTemplate"));
  try {
    await project.create({
      manifestPatch: {
        name: answers.name,
        description: answers.description,
        homepage_url: answers.homepage_url,
      },
      packageJsonPatch: {
        name: packageName,
      },
    });
    logger.info(getMessage("templateSetupCompleted"));
    await project.installDependencies();
    await project.generatePrivateKey();
    logger.info(
      getSuccessCreatedPluginMessage(packageName, answers.projectName),
    );
  } catch (error) {
    // Nothing was created when the directory already exists.
    if (error instanceof PluginDirectoryExistsError) {
      throw error;
    }
    await project.remove();
    throw new PluginProjectCreationError(error);
  }
};

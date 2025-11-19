import chalk from "chalk";
import type { Lang } from "../utils/lang";
import { getBoundMessage, getMessage } from "../utils/messages";
import { setupTemplate } from "../utils/template";
import { runPrompt } from "../utils/qa";
import { logger } from "../../../utils/log";
import path from "path";
import fs from "fs";
import { installDependencies } from "../utils/deps";

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

/**
 * Run create-kintone-plugin script
 * @param outputDir
 * @param lang
 * @param templateName
 */
export const initPlugin = async (
  outputDir: string,
  lang: Lang,
  templateName: string,
) => {
  const m = getBoundMessage(lang);
  logger.info(`

  ${m("introduction")}

  `);

  try {
    const answers = await runPrompt(m, outputDir, lang);
    const packageName = path.basename(outputDir);
    logger.info(m("settingUpTemplate"));
    logger.debug(`templateName: ${templateName}`);
    await setupTemplate({
      outputDir,
      templateName,
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
    installDependencies(outputDir, lang);
    logger.info(getSuccessCreatedPluginMessage(packageName, outputDir, lang));
  } catch (error) {
    try {
      await fs.promises.rm(outputDir, { recursive: true, force: true });
      if (
        error instanceof Error &&
        error.message === "output directory already exists"
      ) {
        logger.error(`${outputDir} ${getMessage(lang, "Error_alreadyExists")}`);
      } else if (error instanceof Error) {
        logger.error(m("Error_cannotCreatePlugin") + error.message);
      } else {
        logger.error(m("Error_cannotCreatePlugin") + String(error));
      }
    } finally {
      // eslint-disable-next-line n/no-process-exit
      process.exit(1);
    }
  }
};

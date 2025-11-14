import chalk = require("chalk");
import * as fs from "fs";
import { rimraf } from "rimraf";
import type { Lang } from "../utils/lang";
import { getBoundMessage, getMessage } from "../utils/messages";
import { setupTemplate } from "../utils/template";
import { runPrompt } from "../utils/qa";
import { logger } from "../../../utils/log";
import path = require("path");
import { installDependencies } from "../utils/deps";

/**
 * Verify whether the output directory is valid
 * @param outputDirectory
 * @param lang
 */
const verifyOutputDirectory = (outputDirectory: string, lang: Lang): void => {
  if (fs.existsSync(outputDirectory)) {
    throw new Error(
      `${outputDirectory} ${getMessage(lang, "Error_alreadyExists")}`,
    );
  }
};

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
export const initPlugin = (
  outputDir: string,
  lang: Lang,
  templateName: string,
) => {
  const m = getBoundMessage(lang);
  verifyOutputDirectory(outputDir, lang);
  logger.info(`

  ${m("introduction")}

  `);

  runPrompt(m, outputDir, lang)
    .then(async (answers): Promise<string> => {
      const packageName = path.basename(outputDir);
      logger.debug(`manifest built: type = ${templateName}`);
      await setupTemplate({
        outputDir,
        templateName,
        packageName,
        answers,
      });
      installDependencies(outputDir, lang);
      return packageName;
    })
    .then((packageName) => {
      logger.info(getSuccessCreatedPluginMessage(packageName, outputDir, lang));
    })
    .catch((error: Error) => {
      rimraf(outputDir, { glob: true })
        .then(() => {
          logger.error(m("Error_cannotCreatePlugin") + error.message);
        })
        .finally(() => {
          // eslint-disable-next-line n/no-process-exit
          process.exit(1);
        });
    });
};

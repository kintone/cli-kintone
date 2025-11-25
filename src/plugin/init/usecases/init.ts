import chalk from "chalk";
import type { Lang } from "../utils/lang";
import { getBoundMessage, getMessage } from "../utils/messages";
import { setupTemplate } from "../utils/template";
import { runPrompt } from "../utils/qa";
import { logger } from "../../../utils/log";
import path from "path";
import fs from "fs";
import { installDependencies } from "../utils/deps";
import { isDirectory } from "../../../utils/file";

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

/**
 * Run create-kintone-plugin script
 */
export const initPlugin = async (options: InitPluginOptions) => {
  const m = getBoundMessage(options.lang);
  logger.info(`

  ${m("introduction")}

  `);

  const answers = await runPrompt(m, options.name);

  // outputDirを決定: CLI引数があればそれを使用、なければQAで入力されたプロジェクト名を使用
  const outputDir = options.name ?? `./${answers.projectName}`;
  const packageName = path.basename(outputDir);
  logger.info(m("settingUpTemplate"));
  logger.debug(`template: ${options.template}`);

  // Verify output directory does not exist
  const directoryExists = await isDirectory(outputDir);
  if (directoryExists) {
    logger.error(
      `${outputDir} ${getMessage(options.lang, "Error_alreadyExists")}`,
    );
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }

  try {
    await setupTemplate({
      outputDir,
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
    installDependencies(outputDir, options.lang);
    logger.info(
      getSuccessCreatedPluginMessage(packageName, outputDir, options.lang),
    );
  } catch (error) {
    try {
      await fs.promises.rm(outputDir, { recursive: true, force: true });
      if (error instanceof Error) {
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

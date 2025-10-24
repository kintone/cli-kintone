"use strict";

import chalk = require("chalk");
import * as fs from "fs";
import { rimraf } from "rimraf";
import { generatePlugin } from "./generator";
import type { Lang } from "./lang";
import type { Manifest } from "./manifest";
import { buildManifest } from "./manifest";
import { getBoundMessage, getMessage } from "./messages";
import type { TemplateType } from "./template";
import { runPrompt } from "./qa";
import { logger } from "../../../utils/log";

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
  manifest: Manifest,
  outputDir: string,
  enablePluginUploader: boolean,
  lang: Lang,
) => {
  const m = getBoundMessage(lang);
  return `

Success! Created ${manifest.name.en} at ${outputDir}

${chalk.cyan("npm start")}

  ${m("npmStart")}
  ${enablePluginUploader ? m("npmStartWithPluginUploader") : ""}

${chalk.cyan("npm run build")}

  ${m("npmBuild")}

${chalk.cyan("npm run lint")}

  ${m("npmLint")}

${m("nextAction")}
${enablePluginUploader ? m("howToUsePluginUploader") : ""}

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
 * @param templateType
 */
export const init = (
  outputDir: string,
  lang: Lang,
  templateType: TemplateType,
) => {
  const m = getBoundMessage(lang);
  verifyOutputDirectory(outputDir, lang);
  logger.info(`

  ${m("introduction")}

  `);

  runPrompt(m, outputDir, lang)
    .then(async (answers): Promise<[Manifest, boolean]> => {
      const manifest = buildManifest(answers, templateType);
      logger.debug(`manifest built: type = ${templateType}`);
      await generatePlugin(
        outputDir,
        manifest,
        lang,
        answers.enablePluginUploader,
        templateType,
      );
      return [manifest, answers.enablePluginUploader];
    })
    .then(([manifest, enablePluginUploader]) => {
      logger.info(
        getSuccessCreatedPluginMessage(
          manifest,
          outputDir,
          enablePluginUploader,
          lang,
        ),
      );
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

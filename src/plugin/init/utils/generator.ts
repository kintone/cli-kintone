"use strict";

import * as fs from "fs";
import { globSync } from "glob";
import * as path from "path";
import { installDependencies } from "./deps";
import type { Lang } from "./lang";
import type { Manifest } from "./manifest";
import { generatePrivateKey } from "./privateKey";
import type { TemplateType } from "./template";
import {
  getTemplateDir,
  isNecessaryFile,
  processTemplateFile,
} from "./template";
import { logger } from "../../../utils/log";

/**
 * Create a plugin project based on passed manifest and install dependencies
 * @param outputDirectory
 * @param manifest
 * @param lang
 * @param templateType
 */
export const generatePlugin = async (
  outputDirectory: string,
  manifest: Manifest,
  lang: Lang,
  templateType: TemplateType,
): Promise<void> => {
  // copy and build a project into the output diretory
  await buildProject(outputDirectory, manifest, templateType);
  // npm install
  installDependencies(outputDirectory, lang);
};

/**
 * Create a plugin project based on passed manifest
 * @param outputDirectory
 * @param manifest
 * @param templateType
 */
const buildProject = async (
  outputDirectory: string,
  manifest: Manifest,
  templateType: TemplateType,
): Promise<void> => {
  fs.mkdirSync(outputDirectory);

  const templatePath = path.join(getTemplateDir(), templateType);
  const templatePathPattern = path.normalize(
    path.resolve(templatePath, "**", "*"),
  );
  logger.debug(`template path: ${templatePath}`);
  const templateFiles = globSync(templatePathPattern, {
    dot: true,
  }).filter((file) => isNecessaryFile(manifest, file));
  for (const file of templateFiles) {
    await processTemplateFile(file, templatePath, outputDirectory, manifest);
  }

  fs.writeFileSync(
    path.resolve(outputDirectory, "private.ppk"),
    generatePrivateKey(),
  );
  fs.writeFileSync(
    path.resolve(
      outputDirectory,
      templateType === "typescript" ? "plugin" : "src",
      "manifest.json",
    ),
    JSON.stringify(manifest, null, 2),
  );
};

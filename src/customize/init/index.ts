import fs from "fs/promises";
import path from "path";
import { confirm } from "@inquirer/prompts";
import { logger } from "../../utils/log";
import { getBoundMessage } from "../core";
import type { CustomizeManifest } from "../core";
import { isFile } from "../../utils/file";

export interface InitParams {
  scope: "ALL" | "ADMIN" | "NONE";
  outputPath: string;
  yes: boolean;
}

export const getInitCustomizeManifest = (
  scope: "ALL" | "ADMIN" | "NONE",
): CustomizeManifest => {
  return {
    scope,
    desktop: {
      js: [],
      css: [],
    },
    mobile: {
      js: [],
      css: [],
    },
  };
};

export const generateCustomizeManifest = async (
  customizeManifest: CustomizeManifest,
  outputPath: string,
) => {
  const destDir = path.dirname(outputPath);
  logger.debug(`Writing manifest to: ${outputPath}`);
  logger.debug(`Creating directory: ${destDir}`);
  await fs.mkdir(destDir, { recursive: true });
  const manifestJson = JSON.stringify(customizeManifest, null, 4);
  await fs.writeFile(outputPath, manifestJson);
  return manifestJson;
};

export const runInit = async (params: InitParams) => {
  const { scope, outputPath, yes } = params;
  const m = getBoundMessage("en");

  logger.debug(`Initializing manifest with scope: ${scope}`);
  logger.debug(`Output path: ${outputPath}`);

  // Check if file already exists and prompt for overwrite
  if ((await isFile(outputPath)) && !yes) {
    logger.debug(`File already exists: ${outputPath}`);
    const shouldOverwrite = await confirm({
      message: `File "${outputPath}" already exists. Overwrite?`,
      default: false,
    });
    if (!shouldOverwrite) {
      logger.info("Operation cancelled.");
      return;
    }
  }

  const customizeManifest = getInitCustomizeManifest(scope);
  await generateCustomizeManifest(customizeManifest, outputPath);
  logger.info(`${outputPath} ${m("M_CommandInitFinish")}`);
};

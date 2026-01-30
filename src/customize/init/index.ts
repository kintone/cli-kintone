import fs from "fs/promises";
import path from "path";
import { confirm } from "@inquirer/prompts";
import { logger } from "../../utils/log";
import { getBoundMessage } from "../core";
import type { CustomizeManifest } from "../core";
import { isFile } from "../../utils/file";

export interface InitParams {
  outputPath: string;
  yes: boolean;
}

export const getInitCustomizeManifest = (): CustomizeManifest => {
  return {
    scope: "ALL",
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
  const { outputPath, yes } = params;
  const m = getBoundMessage("en");

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

  const customizeManifest = getInitCustomizeManifest();
  await generateCustomizeManifest(customizeManifest, outputPath);
  logger.info(m("M_CommandInitFinish"));
};

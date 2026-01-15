import fs from "fs";
import path from "path";
import { mkdirp } from "mkdirp";
import { confirm } from "@inquirer/prompts";
import { logger } from "../../utils/log";
import { getBoundMessage } from "../core";
import type { CustomizeManifest } from "../core";

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

export const generateCustomizeManifest = (
  customizeManifest: CustomizeManifest,
  outputPath: string,
): Promise<string> => {
  const destDir = path.dirname(outputPath);
  if (destDir && !fs.existsSync(destDir)) {
    mkdirp.sync(destDir);
  }
  return new Promise((resolve, reject) => {
    return fs.writeFile(
      outputPath,
      JSON.stringify(customizeManifest, null, 4),
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(customizeManifest, null, 4));
        }
      },
    );
  });
};

export const runInit = async (params: InitParams): Promise<void> => {
  const { scope, outputPath, yes } = params;
  const m = getBoundMessage("en");

  // Check if file already exists and prompt for overwrite
  if (fs.existsSync(outputPath) && !yes) {
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

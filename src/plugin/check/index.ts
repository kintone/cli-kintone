import fs from "fs/promises";
import {
  type ManifestInterface,
  type DriverInterface,
  LocalFSDriver,
  ManifestFactory,
  PluginZip,
} from "../core";

import path from "path";
import { logger } from "../../utils/log";
import { ESLint } from "eslint";
import eslintJs from "@eslint/js";

export const check = async (inputFilePath: string) => {
  let manifest: ManifestInterface;
  let driver: DriverInterface;

  // TODO: Better file type detection
  switch (path.extname(inputFilePath)) {
    case ".json": {
      manifest = await ManifestFactory.loadJsonFile(inputFilePath);
      driver = new LocalFSDriver(path.dirname(inputFilePath));
      break;
    }
    case ".zip": {
      const buffer = await fs.readFile(inputFilePath);
      const pluginZip = await PluginZip.fromBuffer(buffer);
      manifest = await pluginZip.manifest();
      driver = await pluginZip.contentsZip();
      break;
    }
    default: {
      throw new Error(`Unsupported file format: ${inputFilePath}`);
    }
  }

  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [eslintJs.configs.all],
  });

  for (const source of manifest.sourceList()) {
    if (path.extname(source) !== ".js") {
      logger.info(`Skip ${source}`);
      continue;
    }

    logger.info(`Checking ${source}`);
    const sourceFile = await driver.readFile(source);
    // console.log(sourceFile.toString());
    const results = await eslint.lintText(sourceFile.toString(), {
      filePath: source,
    });
    for (const result of results) {
      console.log(
        `Error: ${result.errorCount}, Warning: ${result.warningCount}`,
      );
      for (const message of result.messages) {
        console.log(
          `  Line ${message.line} ${message.severity === 1 ? "Warning" : "Error"}: ${message.message}`,
        );
      }
    }
  }

  // TODO: Support multiple output formats
  // switch (format) {
  //   case "plain":
  //     console.log("id:", info.id);
  //     console.log("name:", info.name);
  //     console.log("version:", info.version);
  //     console.log("description:", info.description ?? "(not set)");
  //     console.log("homepage:", info.homepage ?? "(not set)");
  //     break;
  //   case "json":
  //     console.log(JSON.stringify(info, null, 2));
  // }
};

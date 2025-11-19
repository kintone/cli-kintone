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
import type { Linter } from "eslint";
import { ESLint } from "eslint";
import noCybozuData from "./rules/no-cybozu-data";
import noKintoneInternalSelector from "./rules/no-kintone-internal-selector";

const eslintConfig: Linter.Config[] = [
  {
    // https://eslint.org/docs/latest/use/configure/plugins#configure-a-virtual-plugin
    plugins: {
      local: {
        rules: {
          "no-cybozu-data": noCybozuData,
          "no-kintone-internal-selector": noKintoneInternalSelector,
        },
      },
    },
    rules: {
      "local/no-cybozu-data": "error",
      "local/no-kintone-internal-selector": "error",
    },
    linterOptions: { reportUnusedDisableDirectives: false },
  },
];

export type OutputFormat = "plain" | "json";

export const check = async (inputFilePath: string, format: OutputFormat) => {
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
    overrideConfig: eslintConfig,
  });

  const allResults: AllResult = {
    errorCount: 0,
    warningCount: 0,
    filesChecked: 0,
    filesSkipped: 0,
    files: [],
  };

  for (const source of manifest.sourceList()) {
    if (path.extname(source) !== ".js") {
      allResults.filesSkipped++;
      logger.debug(`Skip ${source}`);
      continue;
    }

    logger.debug(`Checking ${source}`);
    allResults.filesChecked++;
    const sourceFile = await driver.readFile(source);
    const results = normalizeResults(
      await eslint.lintText(sourceFile.toString(), {
        filePath: source,
      }),
    );

    const fileResult: FileResult = {
      filePath: source,
      messages: [],
      errorCount: 0,
      warningCount: 0,
    };
    for (const result of results) {
      fileResult.errorCount += result.errorCount;
      fileResult.warningCount += result.warningCount;

      fileResult.messages.push(...result.messages);
    }
    allResults.errorCount += fileResult.errorCount;
    allResults.warningCount += fileResult.warningCount;
    allResults.files.push(fileResult);
  }

  console.log(formatResult(allResults, format));
};

const normalizeResults = (results: ESLint.LintResult[]) => {
  const newResults: ESLint.LintResult[] = [];
  for (const result of results) {
    let errorCount = 0;
    let warningCount = 0;
    let fixableErrorCount = 0;
    let fixableWarningCount = 0;
    let fatalErrorCount = 0;

    const messages: ESLint.LintResult["messages"] = [];
    for (const m of result.messages) {
      if (m.message.match(/Definition for rule '.+' was not found./)) {
        continue;
      }
      messages.push(m);
      if (m.severity === 1) {
        warningCount++;
        if (m.fix !== undefined) {
          fixableWarningCount++;
        }
      } else if (m.severity === 2) {
        errorCount++;
        if (m.fix !== undefined) {
          fixableErrorCount++;
        }
        if (m.fatal) {
          fatalErrorCount++;
        }
      }
    }
    newResults.push({
      ...result,
      errorCount,
      fatalErrorCount,
      warningCount,
      fixableErrorCount,
      fixableWarningCount,
      messages: messages,
    });
  }
  return newResults;
};

type AllResult = {
  errorCount: number;
  warningCount: number;
  filesChecked: number;
  filesSkipped: number;
  files: FileResult[];
};

type FileResult = {
  filePath: string;
  messages: ESLint.LintResult["messages"];
  errorCount: number;
  warningCount: number;
};

const formatResult = (allResults: AllResult, format: OutputFormat) => {
  switch (format) {
    case "plain": {
      let output = "";
      for (const fileResult of allResults.files) {
        if (fileResult.errorCount > 0 || fileResult.warningCount > 0) {
          output += `\n`;
          output += `${fileResult.filePath}\n`;
          for (const message of fileResult.messages) {
            const line = `${`${message.line}:${message.column}`.padEnd(7)}`;
            const severity = (
              message.severity === 1 ? "warning" : "error"
            ).padEnd(6);
            output += `  ${line} ${severity}  ${message.message}  (${message.ruleId})\n`;
          }
        }
      }

      output += `\n`;
      output += `Files checked: ${allResults.filesChecked}\n`;
      output += `Problems: ${allResults.errorCount + allResults.warningCount} (Errors: ${allResults.errorCount}, Warnings: ${allResults.warningCount})\n`;

      return output;
    }
    case "json":
      return JSON.stringify(allResults, null, 2);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

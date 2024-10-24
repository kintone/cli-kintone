import validate from "@kintone/plugin-manifest-validator";
import _debug from "debug";
import fs from "fs";
import path from "path";
import { logger } from "../../../utils/log";
import { generateErrorMessages } from "./gen-error-msg";

const debug = _debug("validate");

export const validateManifestJson = (
  manifestJson: string,
  pluginDir: string,
) => {
  const manifest = JSON.parse(manifestJson);
  const result = validate(manifest, {
    maxFileSize: validateMaxFileSize(pluginDir),
    fileExists: validateFileExists(pluginDir),
  });
  debug(result);

  if (result.warnings && result.warnings.length > 0) {
    result.warnings.forEach((warning) => {
      logger.warn(warning.message);
    });
  }

  if (!result.valid) {
    const msgs = generateErrorMessages(result.errors ?? []);
    logger.error("Invalid manifest.json:");
    msgs.forEach((msg) => {
      logger.error(`- ${msg}`);
    });
    throw new Error("Invalid manifest.json");
  }
};

/**
 * Return validator for `maxFileSize` keyword
 */
const validateMaxFileSize = (pluginDir: string) => {
  return (maxBytes: number, filePath: string) => {
    try {
      const stat = fs.statSync(path.join(pluginDir, filePath));
      return stat.size <= maxBytes;
    } catch (_) {
      return false;
    }
  };
};

/**
 *
 * @param pluginDir
 */
const validateFileExists = (pluginDir: string) => {
  return (filePath: string) => {
    try {
      const stat = fs.statSync(path.join(pluginDir, filePath));
      return stat.isFile();
    } catch (_) {
      return false;
    }
  };
};

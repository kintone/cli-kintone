import validate from "@kintone/plugin-manifest-validator";
import _debug from "debug";
import fs from "fs";
import path from "path";
import { logger } from "../../../utils/log";

const debug = _debug("validate");

export const validateManifestJson = (
  manifestJson: string,
  pluginDir: string,
) => {
  const manifest = JSON.parse(manifestJson);
  const result = validate(manifest, {
    // maxFileSize: validateMaxFileSize(pluginDir),
    // fileExists: validateFileExists(pluginDir),
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

import type * as Ajv from "ajv";

export const generateErrorMessages = (errors: Ajv.ErrorObject[]): string[] => {
  return errors.map((e) => {
    if (e.keyword === "enum") {
      return `"${e.instancePath}" ${e.message} (${(
        e.params.allowedValues as any[]
      )
        .map((v) => `"${v}"`)
        .join(", ")})`;
    }
    return `"${e.instancePath}" ${e.message}`;
  });
};

import path from "path";
import fs from "fs";
import { promisify } from "util";
import os from "os";
import * as chokidar from "chokidar";
import { mkdirp } from "mkdirp";
import _debug from "debug";
import packer from "./index";
import { logger } from "../../utils/log";
import { ManifestV1 } from "./manifest";
import { generateErrorMessages } from "./manifest/validate";
import { ContentsZip } from "./contents-zip";

const debug = _debug("cli");
const writeFile = promisify(fs.writeFile);

type Options = Partial<{
  ppk: string;
  out: string;
  watch: boolean;
  packerMock_: typeof packer;
}>;

const cli = async (pluginDir: string, options_?: Options) => {
  const options = options_ || {};
  const packerLocal = options.packerMock_ ? options.packerMock_ : packer;

  try {
    // 1. check if pluginDir is a directory
    if (!fs.statSync(pluginDir).isDirectory()) {
      throw new Error(`${pluginDir} should be a directory.`);
    }

    // 2. check pluginDir/manifest.json
    const manifestJsonPath = path.join(pluginDir, "manifest.json");
    if (!fs.statSync(manifestJsonPath).isFile()) {
      throw new Error("Manifest file $PLUGIN_DIR/manifest.json not found.");
    }

    // 3. validate manifest.json
    const manifest = await ManifestV1.loadJsonFile(manifestJsonPath);
    const result = manifest.validate({
      maxFileSize: validateMaxFileSize(pluginDir),
      fileExists: validateFileExists(pluginDir),
    });
    // For cli
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

    let outputDir = path.dirname(path.resolve(pluginDir));
    let outputFile = path.join(outputDir, "plugin.zip");
    if (options.out) {
      outputFile = options.out;
      outputDir = path.dirname(path.resolve(outputFile));
    }
    debug(`outputDir : ${outputDir}`);
    debug(`outputFile : ${outputFile}`);

    // 4. generate new ppk if not specified
    const ppkFile = options.ppk;
    let privateKey: string | undefined;
    if (ppkFile) {
      debug(`loading an existing key: ${ppkFile}`);
      privateKey = fs.readFileSync(ppkFile, "utf8");
    }

    // 5. package plugin.zip
    await mkdirp(outputDir);
    const contentsZip = await ContentsZip.createFromManifest(
      pluginDir,
      manifest,
    );

    const output = await packerLocal(contentsZip.buffer, privateKey);
    const ppkFilePath = path.join(outputDir, `${output.id}.ppk`);
    if (!ppkFile) {
      fs.writeFileSync(ppkFilePath, output.privateKey, "utf8");
    }

    if (options.watch) {
      // change events are fired before chagned files are flushed on Windows,
      // which generate an invalid plugin zip.
      // in order to fix this, we use awaitWriteFinish option only on Windows.
      const watchOptions =
        os.platform() === "win32"
          ? {
              awaitWriteFinish: {
                stabilityThreshold: 1000,
                pollInterval: 250,
              },
            }
          : {};
      const watcher = chokidar.watch(pluginDir, watchOptions);
      watcher.on("change", () => {
        cli(
          pluginDir,
          Object.assign({}, options, {
            watch: false,
            ppk: options.ppk || ppkFilePath,
          }),
        );
      });
    }
    await outputPlugin(outputFile, output.plugin);

    logger.info(`Succeeded: ${outputFile}`);
    return outputFile;
  } catch (error) {
    logger.error(`Failed: ${error}`);
    return Promise.reject(error);
  }
};

export = cli;

/**
 * Create and save plugin.zip
 */
const outputPlugin = async (
  outputPath: string,
  plugin: Buffer,
): Promise<string> => {
  await writeFile(outputPath, plugin);
  return outputPath;
};

/**
 * Load JSON file without caching
 */
const loadJson = (jsonPath: string) => {
  const content = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(content);
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

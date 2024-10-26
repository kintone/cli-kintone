import path from "path";
import fs from "fs";
import { promisify } from "util";
import os from "os";
import * as chokidar from "chokidar";
import { mkdirp } from "mkdirp";
import _debug from "debug";
import { logger } from "../../../utils/log";
import { ManifestFactory } from "../manifest";
import { validateFileExists, validateMaxFileSize } from "../manifest/validate";
import type { PluginZipInterface } from "../plugin-zip";
import { PluginZip } from "../plugin-zip";
import { LocalFSDriver } from "../driver";
import { PrivateKey } from "../crypto";

const debug = _debug("cli");
const writeFile = promisify(fs.writeFile);

type Options = Partial<{
  ppk: string;
  out: string;
  watch: boolean;
}>;

// TODO: Reduce statements in this func
// eslint-disable-next-line max-statements
export const run = async (pluginDir: string, options_?: Options) => {
  const options = options_ || {};

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
    const manifest = await ManifestFactory.loadJsonFile(manifestJsonPath);
    if (manifest.manifestVersion === 2) {
      logger.warn("Welcome to manifest v2 mode :)");
    }

    const result = manifest.validate({
      maxFileSize: validateMaxFileSize(new LocalFSDriver(pluginDir)),
      fileExists: validateFileExists(new LocalFSDriver(pluginDir)),
    });
    // For cli
    if (result.warnings.length > 0) {
      result.warnings.forEach((warning) => {
        logger.warn(warning);
      });
    }

    if (!result.valid) {
      logger.error("Invalid manifest.json:");
      result.errors.forEach((msg) => {
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
    let privateKey: PrivateKey;
    if (ppkFile) {
      debug(`loading an existing key: ${ppkFile}`);
      const ppk = fs.readFileSync(ppkFile, "utf8");
      privateKey = PrivateKey.importKey(ppk);
    } else {
      debug("generating a new key");
      privateKey = PrivateKey.generateKey();
    }

    const id = privateKey.uuid();
    debug(`id : ${id}`);

    // 5. package plugin.zip
    await mkdirp(outputDir);
    const pluginZip = await PluginZip.build(
      manifest,
      privateKey,
      new LocalFSDriver(pluginDir),
    );

    const ppkFilePath = path.join(outputDir, `${id}.ppk`);
    if (!ppkFile) {
      fs.writeFileSync(ppkFilePath, privateKey.exportPrivateKey(), "utf8");
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
        run(
          pluginDir,
          Object.assign({}, options, {
            watch: false,
            ppk: options.ppk || ppkFilePath,
          }),
        );
      });
    }
    await outputPlugin(outputFile, pluginZip);

    logger.info(`Succeeded: ${outputFile}`);
    return outputFile;
  } catch (error) {
    logger.error(`Failed: ${error}`);
    return Promise.reject(error);
  }
};

/**
 * Create and save plugin.zip
 */
const outputPlugin = async (
  outputPath: string,
  plugin: PluginZipInterface,
): Promise<string> => {
  await writeFile(outputPath, plugin.buffer);
  return outputPath;
};

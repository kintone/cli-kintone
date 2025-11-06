import path from "path";
import fs from "fs/promises";
import os from "os";
import * as chokidar from "chokidar";
import { logger } from "../../utils/log";
import { ManifestFactory, PluginZip, PrivateKey, LocalFSDriver } from "../core";
import { isFile } from "../../utils/file";

type Params = {
  input: string;
  ppkFilePath: string;
  output?: string;
  watch?: boolean;
};

// TODO: Reduce statements in this func

export const pack = async (params: Params) => {
  const manifestJsonFilePath = path.resolve(params.input);
  logger.debug(`input manifest file path: ${manifestJsonFilePath}`);
  const outputFilePath = path.resolve(params.output || "./plugin.zip");
  logger.debug(`output file path: ${outputFilePath}`);

  // Root directory of source files
  // Default to the directory where manifest.json is located
  const sourceRootDir = path.resolve(path.dirname(manifestJsonFilePath));

  // 1. Validate input parameters
  // Check manifest.json exists
  if (!(await isFile(manifestJsonFilePath))) {
    throw new Error(`Manifest file not found: ${manifestJsonFilePath}`);
  }

  // Check ppk exists
  const ppkFilePath = path.resolve(params.ppkFilePath);
  if (!(await isFile(ppkFilePath))) {
    throw new Error(`Private key file not found: ${ppkFilePath}`);
  }

  // 2. Load manifest.json
  const manifest = await ManifestFactory.loadJsonFile(manifestJsonFilePath);
  if (manifest.manifestVersion === 2) {
    logger.warn("Welcome to manifest v2 mode :)");
  }

  // 3. Validate manifest.json
  const result = await manifest.validate(new LocalFSDriver(sourceRootDir));

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

  // 4. Prepare output directory
  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  logger.debug(`outputFile: ${outputFilePath}`);

  // 5. Load ppk or generate new ppk if not specified
  logger.debug(`loading an existing key: ${ppkFilePath}`);
  const ppk = await fs.readFile(ppkFilePath, "utf8");
  const privateKey = PrivateKey.importKey(ppk);

  const id = privateKey.uuid();
  logger.debug(`plugin id: ${id}`);

  // 6. Package plugin.zip
  const pluginZip = await PluginZip.build(
    manifest,
    privateKey,
    new LocalFSDriver(sourceRootDir),
  );

  // 7. Start watch mode if watch option is given
  if (params.watch) {
    // change events are fired before changed files are flushed on Windows,
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
    const watchTargets = [
      manifestJsonFilePath,
      ...manifest.sourceList().map((src) => path.resolve(sourceRootDir, src)),
    ];
    const watcher = chokidar.watch(watchTargets, watchOptions);
    watcher.on("change", () => {
      pack({
        ...params,
        watch: false,
      });
    });
  }

  // 8. Write out plugin.zip to filesystem
  await fs.writeFile(outputFilePath, pluginZip.buffer);

  logger.info(`The plugin file generated: ${outputFilePath}`);
};

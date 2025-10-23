import path from "path";
import fs from "fs/promises";
import os from "os";
import * as chokidar from "chokidar";
import { logger } from "../../utils/log";
import { ManifestFactory, PluginZip, PrivateKey, LocalFSDriver } from "../core";

type Params = {
  input: string;
  ppkFilePath: string;
  output?: string;
  watch?: boolean;
};

// TODO: Reduce statements in this func

export const pack = async (params: Params) => {
  const pluginDir = path.resolve(params.input);
  // const outputDir = path.resolve(params.output || "./plugin.zip");

  // 1. Validate input parameters
  // 1.1 Check if pluginDir is a directory
  if (!(await fs.stat(pluginDir)).isDirectory()) {
    throw new Error(`${pluginDir} should be a directory.`);
  }

  // 1.2 Check pluginDir/manifest.json
  const manifestJsonPath = path.join(pluginDir, "manifest.json");
  if (!(await fs.stat(manifestJsonPath)).isFile()) {
    throw new Error("Manifest file $PLUGIN_DIR/manifest.json not found.");
  }

  // 2. Load manifest.json
  const manifest = await ManifestFactory.loadJsonFile(manifestJsonPath);
  if (manifest.manifestVersion === 2) {
    logger.warn("Welcome to manifest v2 mode :)");
  }

  // 3. Validate manifest.json
  const result = await manifest.validate(new LocalFSDriver(pluginDir));

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
  let outputDir = path.dirname(path.resolve(pluginDir));
  let outputFile = path.join(outputDir, "plugin.zip");
  if (outputDir) {
    outputFile = outputDir;
    outputDir = path.dirname(path.resolve(outputFile));
  }
  await fs.mkdir(outputDir, { recursive: true });
  logger.debug(`outputDir: ${outputDir}`);
  logger.debug(`outputFile: ${outputFile}`);

  // 5. Load ppk or generate new ppk if not specified
  const ppkFilePath = path.resolve(params.ppkFilePath);
  logger.debug(`loading an existing key: ${ppkFilePath}`);
  const ppk = await fs.readFile(ppkFilePath, "utf8");
  const privateKey = PrivateKey.importKey(ppk);

  const id = privateKey.uuid();
  logger.debug(`plugin id: ${id}`);

  // 6. Package plugin.zip
  const pluginZip = await PluginZip.build(
    manifest,
    privateKey,
    new LocalFSDriver(pluginDir),
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
    const watcher = chokidar.watch(pluginDir, watchOptions);
    watcher.on("change", () => {
      pack({
        ...params,
        watch: false,
      });
    });
  }

  // 7. Write out plugin.zip to filesystem
  await fs.writeFile(outputFile, pluginZip.buffer);

  logger.info(`The plugin file generated: ${outputFile}`);
};

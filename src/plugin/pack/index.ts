import path from "path";
import { pack } from "./usecases/pack";
import { PluginManifestValidationError } from "./usecases/pack/error";
import { LocalPluginProjectRepositoryFromFiles } from "./repositories/localPluginProjectRepositoryFromFiles";
import { LocalPluginZipRepositoryFromFile } from "./repositories/localPluginZipRepositoryFromFile";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

export type Options = {
  input: string;
  output: string;
  privateKeyPath: string;
  watch: boolean;
};

// Keeps the CLI output of an invalid manifest; RunError prints the heading and the cause without the "Error: " prefix.
const buildErrorOutput = (e: unknown) => {
  if (e instanceof PluginManifestValidationError) {
    return `${e.message}\n${e.cause}\nError: Invalid manifest.json`;
  }
  return new RunError(e);
};

export const run: (options: Options) => Promise<void> = async (options) => {
  // An empty --output also falls back to the default.
  const output = options.output || "./plugin.zip";
  const project = new LocalPluginProjectRepositoryFromFiles({
    manifestPath: options.input,
    privateKeyPath: options.privateKeyPath,
  });
  const pluginZipDestination = new LocalPluginZipRepositoryFromFile(output);

  // A failed rerun in watch mode also ends the process.
  const packOrExit = () => {
    logger.debug(`input manifest file path: ${path.resolve(options.input)}`);
    logger.debug(`output file path: ${path.resolve(output)}`);
    return pack(project, pluginZipDestination).catch((e: unknown) => {
      logger.error(buildErrorOutput(e));
      // eslint-disable-next-line n/no-process-exit
      process.exit(1);
    });
  };

  const manifest = await packOrExit();
  if (options.watch) {
    project.watch(manifest, packOrExit);
  }
};

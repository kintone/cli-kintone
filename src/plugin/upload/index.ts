import path from "path";
import { confirm } from "@inquirer/prompts";
import {
  buildRestAPIClient,
  type RestAPIClientOptions,
} from "../../kintone/client";
import { upload } from "./usecases/upload";
import {
  PluginFileNotFoundError,
  PluginUploadRequestError,
} from "./usecases/upload/error";
import { LocalPluginRepositoryFromZipFile } from "./repositories/localPluginRepositoryFromZipFile";
import { isFile } from "../../utils/file";
import { logger } from "../../utils/log";
import { RunError } from "../../utils/error";

export type Options = RestAPIClientOptions & {
  input: string;
  yes: boolean;
  watch: boolean;
};

// Keeps the CLI output of these failures; RunError prints the heading before the cause.
const buildErrorOutput = (e: unknown) => {
  if (e instanceof PluginFileNotFoundError) {
    return `Error: ${e.cause}`;
  }
  if (e instanceof PluginUploadRequestError) {
    return new RunError(e.cause);
  }
  return new RunError(e);
};

export const run: (options: Options) => Promise<void> = async (options) => {
  const { input, yes, watch, ...restApiClientOptions } = options;
  const filePath = path.resolve(input);
  const pluginSource = new LocalPluginRepositoryFromZipFile(filePath);

  // A failed rerun in watch mode also ends the process.
  const uploadOrExit = async (uploadOptions: {
    yes: boolean;
    watch: boolean;
  }) => {
    try {
      // The file is checked before the API client validates the connection options, so a missing file is reported first.
      if (!(await isFile(filePath))) {
        throw new PluginFileNotFoundError(filePath);
      }
      const apiClient = buildRestAPIClient(restApiClientOptions);
      await upload(
        apiClient,
        pluginSource,
        { baseUrl: restApiClientOptions.baseUrl, ...uploadOptions },
        (message) => confirm({ message, default: false }),
      );
    } catch (e) {
      logger.error(buildErrorOutput(e));
      // eslint-disable-next-line n/no-process-exit
      process.exit(1);
    }
  };

  await uploadOrExit({ yes, watch });
  if (watch) {
    pluginSource.watch(() => uploadOrExit({ yes: true, watch: false }));
  }
};

import type { RestAPIClientOptions } from "../../kintone/client";
import { buildRestAPIClient } from "../../kintone/client";
import { deleteAllRecords } from "./usecases/deleteAll";
import { deleteRecordsByFile } from "./usecases/delete";
import { logger } from "../../utils/log";

export type Options = {
  app: string;
  filePath?: string;
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (options) => {
  try {
    const { app, filePath, ...restApiClientOptions } = options;
    const apiClient = buildRestAPIClient(restApiClientOptions);
    if (filePath) {
      await deleteRecordsByFile(apiClient, app, filePath);
      return;
    }
    await deleteAllRecords(apiClient, app);
  } catch (e) {
    logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

import type { RestAPIClientOptions } from "../kintone/client";
import { buildRestAPIClient } from "../kintone/client";
import { deleteAllRecords } from "./usecases/delete";
import { logger } from "../utils/log";

export type Options = {
  app: string;
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (options) => {
  try {
    const { app, ...restApiClientOptions } = options;
    const apiClient = buildRestAPIClient(restApiClientOptions);
    await deleteAllRecords(apiClient, app);
  } catch (e) {
    logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

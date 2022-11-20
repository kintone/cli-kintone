import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type {
  KintoneRecordForResponse,
  KintoneRecordForDeleteAllParameter,
} from "../../../kintone/types";
import { logger } from "../../../utils/log";
import { DeleteAllRecordsError } from "./error";

export const deleteAllRecords: (
  apiClient: KintoneRestAPIClient,
  app: string
) => Promise<void> = async (apiClient, app) => {
  logger.info("Starting to delete all records...");
  const records = await getRecordsForDeleteAll(apiClient, app);
  try {
    const params = { app, records };
    await apiClient.record.deleteAllRecords(params);
    logger.info(`${records.length} records are deleted successfully`);
  } catch (e) {
    throw new DeleteAllRecordsError(e, records);
  }
};

const getRecordsForDeleteAll: (
  apiClient: KintoneRestAPIClient,
  app: string
) => Promise<KintoneRecordForDeleteAllParameter[]> = async (apiClient, app) => {
  let records: KintoneRecordForDeleteAllParameter[] = [];
  const params = { app, fields: ["$id"] };
  const kintoneRecords = await apiClient.record.getAllRecordsWithId(params);
  if (!kintoneRecords || kintoneRecords.length === 0) {
    return [];
  }

  records = kintoneRecords.map(
    (record: KintoneRecordForResponse): KintoneRecordForDeleteAllParameter => {
      const idValue = record.$id.value as string;
      return {
        id: parseInt(idValue, 10),
      };
    }
  );

  return records;
};

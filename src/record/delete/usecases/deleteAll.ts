import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type {
  KintoneRecordForResponse,
  KintoneRecordForDeleteAllParameter,
} from "../../../kintone/types";
import { logger } from "../../../utils/log";
import { DeleteAllRecordsError } from "./deleteAll/error";

export const deleteAllRecords: (
  apiClient: KintoneRestAPIClient,
  app: string
) => Promise<void> = async (apiClient, app) => {
  logger.info("Starting to delete all records...");
  const records = await generateRecordsParamForDeleteAll(apiClient, app);
  if (records.length === 0) {
    logger.warn("The specified app does not have any records.");
    return;
  }

  try {
    const params = { app, records };
    await apiClient.record.deleteAllRecords(params);
    logger.info(`${records.length} records are deleted successfully`);
  } catch (e) {
    throw new DeleteAllRecordsError(e, records);
  }
};

const generateRecordsParamForDeleteAll: (
  apiClient: KintoneRestAPIClient,
  app: string
) => Promise<KintoneRecordForDeleteAllParameter[]> = async (apiClient, app) => {
  const params = { app, fields: ["$id"] };
  const kintoneRecords = await apiClient.record.getAllRecordsWithId(params);
  if (!kintoneRecords || kintoneRecords.length === 0) {
    return [];
  }

  const records: KintoneRecordForDeleteAllParameter[] = kintoneRecords.map(
    (record: KintoneRecordForResponse): KintoneRecordForDeleteAllParameter => {
      const idValue = record.$id.value as string;
      return {
        id: parseInt(idValue, 10),
      };
    }
  );

  return records;
};

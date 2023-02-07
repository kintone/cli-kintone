import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecordForDeleteAllParameter } from "../../../kintone/types";
import type { RecordNumber, RecordId } from "../types/field";
import { logger } from "../../../utils/log";
import { DeleteSpecifiedRecordsError } from "./delete/error";
import { validateRecordNumbers } from "./delete/validator";
import { getAppCode, convertRecordNumberToRecordId } from "./delete/record";

export const deleteByRecordNumber: (
  apiClient: KintoneRestAPIClient,
  app: string,
  recordNumbers: RecordNumber[]
) => Promise<void> = async (apiClient, app, recordNumbers) => {
  logger.info("Starting to delete records...");
  const appCode = await getAppCode(apiClient, app);
  await validateRecordNumbers(apiClient, app, recordNumbers);

  const records = generateRecordsParam(recordNumbers, appCode);
  try {
    const params = { app, records };
    await apiClient.record.deleteAllRecords(params);
    logger.info(`${records.length} records are deleted successfully`);
  } catch (e) {
    throw new DeleteSpecifiedRecordsError(e, records);
  }
};

const generateRecordsParam = (
  recordNumbers: RecordNumber[],
  appCode: string
): KintoneRecordForDeleteAllParameter[] => {
  const recordIds = convertRecordNumberToRecordId(recordNumbers, appCode);

  return recordIds.map((recordId: RecordId) => {
    return {
      id: recordId,
    };
  });
};

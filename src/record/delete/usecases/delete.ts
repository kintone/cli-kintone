import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type {
  KintoneRecordForDeleteAllParameter,
  FieldsJson,
} from "../../../kintone/types";
import type { RecordNumber, RecordId } from "../types/field";
import { logger } from "../../../utils/log";
import { DeleteRecordsError } from "./delete/error";
import { readFile } from "../../../utils/file";
import { parseRecords } from "../parsers";
import { validateRecordNumbers } from "./delete/validator";
import { getAppCode, convertRecordNumberToRecordId } from "./delete/record";

export const deleteRecordsByFile: (
  apiClient: KintoneRestAPIClient,
  app: string,
  filePath: string
) => Promise<void> = async (apiClient, app, filePath) => {
  const recordNumbers = await getRecordNumbersFromFile(
    apiClient,
    app,
    filePath
  );
  if (recordNumbers.length === 0) {
    logger.warn("The specified CSV file does not have any records.");
    return;
  }

  await deleteRecords(apiClient, app, recordNumbers);
};

export const deleteRecords: (
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
    throw new DeleteRecordsError(e, records);
  }
};

const getRecordNumbersFromFile = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  filePath: string
): Promise<RecordNumber[]> => {
  const fieldsJson = await apiClient.app.getFormFields({ app });
  const recordNumberFieldCode = getRecordNumberFieldCode(fieldsJson.properties);
  const { content, format } = await readFile(filePath);

  return parseRecords({
    source: content,
    format,
    recordNumberFieldCode,
  });
};

const getRecordNumberFieldCode = (
  properties: FieldsJson["properties"]
): string => {
  let recordNumberFieldCode = "";
  for (const property of Object.values(properties)) {
    if (property.type === "RECORD_NUMBER") {
      recordNumberFieldCode = property.code;
      break;
    }
  }

  return recordNumberFieldCode;
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

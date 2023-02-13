import type { RestAPIClientOptions } from "../../kintone/client";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordNumber } from "./types/field";
import type { FieldsJson } from "../../kintone/types";
import { buildRestAPIClient } from "../../kintone/client";
import { deleteAllRecords } from "./usecases/deleteAll";
import { deleteByRecordNumber } from "./usecases/deleteByRecordNumber";
import { logger } from "../../utils/log";
import type { SupportedImportEncoding } from "../../utils/file";
import { readFile } from "../../utils/file";
import { parseRecords } from "./parsers";

export type Options = {
  app: string;
  filePath?: string;
  encoding?: SupportedImportEncoding;
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (options) => {
  try {
    const { app, filePath, encoding, ...restApiClientOptions } = options;
    const apiClient = buildRestAPIClient(restApiClientOptions);
    if (filePath) {
      await deleteRecordsByFile(apiClient, app, filePath, encoding);
      return;
    }
    await deleteAllRecords(apiClient, app);
  } catch (e) {
    logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

const deleteRecordsByFile = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  filePath: string,
  encoding?: SupportedImportEncoding
): Promise<void> => {
  const recordNumbers = await getRecordNumbersFromFile(
    apiClient,
    app,
    filePath,
    encoding
  );
  if (recordNumbers.length === 0) {
    logger.warn("The specified CSV file does not have any records.");
    return;
  }

  await deleteByRecordNumber(apiClient, app, recordNumbers);
};

const getRecordNumbersFromFile = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  filePath: string,
  encoding?: SupportedImportEncoding
): Promise<RecordNumber[]> => {
  const fieldsJson = await apiClient.app.getFormFields({ app });
  const recordNumberFieldCode = getRecordNumberFieldCode(fieldsJson.properties);
  const { content, format } = await readFile(filePath, encoding);

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

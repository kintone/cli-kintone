import type { RestAPIClientOptions } from "../../kintone/client.js";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { RecordNumber } from "./types/field.js";
import type { FieldsJson } from "../../kintone/types.js";
import { buildRestAPIClient } from "../../kintone/client.js";
import { deleteAllRecords } from "./usecases/deleteAll.js";
import { deleteByRecordNumber } from "./usecases/deleteByRecordNumber.js";
import { logger } from "../../utils/log.js";
import type { SupportedImportEncoding } from "../../utils/file.js";
import { readFile } from "../../utils/file.js";
import { isMismatchEncoding } from "../../utils/encoding.js";
import { parseRecords } from "./parsers/index.js";
import { RunError } from "../error/index.js";

export type Options = {
  app: string;
  filePath?: string;
  encoding?: SupportedImportEncoding;
};

export const run: (
  argv: RestAPIClientOptions & Options,
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
    logger.error(new RunError(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

const deleteRecordsByFile = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  filePath: string,
  encoding?: SupportedImportEncoding,
): Promise<void> => {
  if (encoding) {
    await validateEncoding(filePath, encoding);
  }

  const recordNumbers = await getRecordNumbersFromFile(
    apiClient,
    app,
    filePath,
    encoding,
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
  encoding?: SupportedImportEncoding,
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
  properties: FieldsJson["properties"],
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

const validateEncoding: (
  filePath: string,
  encoding: SupportedImportEncoding,
) => Promise<void> = async (filePath, encoding) => {
  if (await isMismatchEncoding(filePath, encoding)) {
    throw new Error(
      `Failed to decode the specified CSV file.\nThe specified encoding (${encoding}) might mismatch the actual encoding of the CSV file.`,
    );
  }
};

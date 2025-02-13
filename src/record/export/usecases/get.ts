import type { KintoneRecordForResponse } from "../../../kintone/types";
import type { LocalRecord } from "../types/record";
import type * as Fields from "../types/field";
import type { FieldSchema, RecordSchema } from "../types/schema";
import type {
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { KintoneRestAPIError } from "@kintone/rest-api-client";

import path from "path";

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getAllRecords } from "./get/getAllRecords";
import type { LocalRecordRepository } from "./interface";
import { replaceSpecialCharacters } from "../utils/file";
import { logger } from "../../../utils/log";
import { retry } from "../../../utils/retry";

export const NO_RECORDS_WARNING =
  "No records exist in the app or match the condition.";

export const getRecords = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  recordDestination: LocalRecordRepository,
  schema: RecordSchema,
  options: {
    condition?: string;
    orderBy?: string;
    attachmentsDir?: string;
  },
  getAllRecordsFn = getAllRecords,
) => {
  const { condition, orderBy, attachmentsDir } = options;
  const writer = recordDestination.writer();
  let numOfProcessedRecords = 0;

  for await (const kintoneRecords of getAllRecordsFn({
    apiClient,
    app,
    condition,
    orderBy,
  })) {
    const localRecords = await recordsReducer(
      kintoneRecords,
      schema,
      (recordId, field, fieldSchema) =>
        fieldProcessor(recordId, field, fieldSchema, {
          apiClient,
          attachmentsDir,
        }),
    );
    numOfProcessedRecords += localRecords.length;
    await writer.write(localRecords);
  }

  if (numOfProcessedRecords === 0) {
    logger.warn(NO_RECORDS_WARNING);
  }

  await writer.end();
};

const recordsReducer: (
  records: KintoneRecordForResponse[],
  schema: RecordSchema,
  task: (
    recordId: string,
    field: KintoneRecordField.OneOf,
    fieldSchema: FieldSchema,
  ) => Promise<Fields.OneOf>,
) => Promise<LocalRecord[]> = async (kintoneRecords, schema, task) => {
  const records: LocalRecord[] = [];
  for (const kintoneRecord of kintoneRecords) {
    const record = await recordConverter(
      kintoneRecord,
      schema,
      (field, fieldSchema) =>
        task(kintoneRecord.$id.value as string, field, fieldSchema),
    );
    records.push(record);
  }
  return records;
};

const recordConverter: (
  record: KintoneRecordForResponse,
  schema: RecordSchema,
  task: (
    field: KintoneRecordField.OneOf,
    fieldSchema: FieldSchema,
  ) => Promise<Fields.OneOf>,
) => Promise<LocalRecord> = async (record, schema, task) => {
  const newRecord: LocalRecord = {};
  // This step filters fields implicitly
  for (const fieldSchema of schema.fields) {
    if (!(fieldSchema.code in record)) {
      throw new Error(`The response is missing a field (${fieldSchema.code})`);
    }
    newRecord[fieldSchema.code] = await task(
      record[fieldSchema.code],
      fieldSchema,
    );
  }
  return newRecord;
};

const fieldProcessor: (
  recordId: string,
  field: KintoneRecordField.OneOf,
  fieldSchema: FieldSchema,
  options: {
    apiClient: KintoneRestAPIClient;
    attachmentsDir?: string;
  },
) => Promise<Fields.OneOf> = async (recordId, field, fieldSchema, options) => {
  const { apiClient, attachmentsDir } = options;

  switch (fieldSchema.type) {
    case "FILE":
      if (attachmentsDir) {
        const downloadedList: Fields.File["value"] = [];
        for (const fileInfo of (field as Fields.File).value) {
          const localFilePath = path.join(
            attachmentsDir,
            `${fieldSchema.code}-${recordId}`,
            process.platform === "win32"
              ? replaceSpecialCharacters(fileInfo.name)
              : fileInfo.name,
          );

          const savedFilePath = await downloadAndSaveFile(
            apiClient,
            fileInfo.fileKey,
            localFilePath,
          );

          downloadedList.push({
            ...fileInfo,
            localFilePath: path.relative(attachmentsDir, savedFilePath),
          });
        }
        return {
          type: "FILE",
          value: downloadedList,
        };
      }
      return field;
    case "SUBTABLE": {
      const newRows = [];
      for (const [rowIndex, row] of (
        field as Fields.Subtable
      ).value.entries()) {
        const fieldsInRow: Fields.Subtable["value"][number]["value"] = {};
        for (const [fieldCodeInSubtable, fieldInSubtable] of Object.entries(
          row.value,
        )) {
          fieldsInRow[fieldCodeInSubtable] = await fieldProcessorInSubtable(
            recordId,
            row.id,
            rowIndex,
            fieldCodeInSubtable,
            fieldInSubtable,
            { apiClient, attachmentsDir },
          );
        }
        newRows.push({ id: row.id, value: fieldsInRow });
      }
      return {
        type: "SUBTABLE",
        value: newRows,
      };
    }
    default:
      return field;
  }
};

const fieldProcessorInSubtable: (
  recordId: string,
  rowId: string,
  rowIndex: number,
  fieldCode: string,
  field: KintoneRecordField.InSubtable,
  options: {
    apiClient: KintoneRestAPIClient;
    attachmentsDir?: string;
  },
) => Promise<Fields.InSubtable> = async (
  recordId,
  rowId,
  rowIndex,
  fieldCode,
  field,
  options,
) => {
  const { apiClient, attachmentsDir } = options;
  switch (field.type) {
    case "FILE":
      if (attachmentsDir) {
        const downloadedList: Fields.File["value"] = [];
        for (const fileInfo of field.value) {
          const localFilePath = path.join(
            attachmentsDir,
            `${fieldCode}-${recordId}-${rowIndex}`,
            process.platform === "win32"
              ? replaceSpecialCharacters(fileInfo.name)
              : fileInfo.name,
          );

          const savedFilePath = await downloadAndSaveFile(
            apiClient,
            fileInfo.fileKey,
            localFilePath,
          );

          downloadedList.push({
            ...fileInfo,
            localFilePath: path.relative(attachmentsDir, savedFilePath),
          });
        }
        return {
          type: "FILE",
          value: downloadedList,
        };
      }
      return field;
    default:
      return field;
  }
};

const downloadAndSaveFile: (
  apiClient: KintoneRestAPIClient,
  fileKey: string,
  localFilePath: string,
) => Promise<string> = async (apiClient, fileKey, localFilePath) => {
  const file = await retry(
    () =>
      apiClient.file.downloadFile({
        fileKey,
      }),
    {
      onError: (e, attemptCount, nextDelay) => {
        logger.warn(
          "Failed to download attachment file due to an error on kintone",
        );
        logger.warn(e);
        logger.warn(
          `Retrying request after ${nextDelay} milliseconds... (count: ${attemptCount})`,
        );
      },
      retryCondition: (e: unknown) =>
        e instanceof KintoneRestAPIError && e.status >= 500 && e.status < 600,
    },
  );

  return saveFileWithoutOverwrite(localFilePath, file);
};

const saveFileWithoutOverwrite: (
  filePath: string,
  file: ArrayBuffer,
) => string = (filePath, file) => {
  const uniqueFilePath = generateUniqueLocalFilePath(filePath);
  mkdirSync(path.dirname(uniqueFilePath), { recursive: true });
  writeFileSync(uniqueFilePath, Buffer.from(file));
  return uniqueFilePath;
};

const generateUniqueLocalFilePath: (filePath: string) => string = (
  filePath,
) => {
  const internal: (index: number) => string = (index) => {
    const newFileName =
      index === 0
        ? path.basename(filePath)
        : `${path.basename(
            filePath,
            path.extname(filePath),
          )} (${index})${path.extname(filePath)}`;
    const newFilePath = path.join(path.dirname(filePath), newFileName);
    if (existsSync(newFilePath)) {
      return internal(index + 1);
    }
    return newFilePath;
  };
  return internal(0);
};

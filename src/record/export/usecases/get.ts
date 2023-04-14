import type { KintoneRecordForResponse } from "../../../kintone/types";
import type { LocalRecord } from "../types/record";
import type * as Fields from "../types/field";
import type { FieldSchema, RecordSchema } from "../types/schema";
import type {
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";

import path from "path";

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { getAllRecords } from "./get/getAllRecords";

export const getRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  schema: RecordSchema,
  options: {
    condition?: string;
    orderBy?: string;
    attachmentsDir?: string;
  }
) => Promise<LocalRecord[]> = async (apiClient, app, schema, options) => {
  const { condition, orderBy, attachmentsDir } = options;
  const kintoneRecords = await apiClient.record.getAllRecords({
    app,
    condition,
    orderBy,
  });
  return recordsReducer(
    kintoneRecords,
    schema,
    (recordId, field, fieldSchema) =>
      fieldProcessor(recordId, field, fieldSchema, {
        apiClient,
        attachmentsDir,
      })
  );
};

// eslint-disable-next-line func-style
export async function* getRecordsGenerator(
  apiClient: KintoneRestAPIClient,
  app: string,
  schema: RecordSchema,
  options: {
    condition?: string;
    orderBy?: string;
    attachmentsDir?: string;
  }
): AsyncGenerator<LocalRecord[], void, undefined> {
  const { condition, orderBy, attachmentsDir } = options;
  for await (const kintoneRecords of getAllRecords({
    apiClient,
    app,
    condition,
    orderBy,
  })) {
    yield recordsReducer(
      kintoneRecords,
      schema,
      (recordId, field, fieldSchema) =>
        fieldProcessor(recordId, field, fieldSchema, {
          apiClient,
          attachmentsDir,
        })
    );
  }
}

const recordsReducer: (
  records: KintoneRecordForResponse[],
  schema: RecordSchema,
  task: (
    recordId: string,
    field: KintoneRecordField.OneOf,
    fieldSchema: FieldSchema
  ) => Promise<Fields.OneOf>
) => Promise<LocalRecord[]> = async (kintoneRecords, schema, task) => {
  const records: LocalRecord[] = [];
  for (const kintoneRecord of kintoneRecords) {
    const record = await recordReducer(
      kintoneRecord,
      schema,
      (field, fieldSchema) =>
        task(kintoneRecord.$id.value as string, field, fieldSchema)
    );
    records.push(record);
  }
  return records;
};

const recordReducer: (
  record: KintoneRecordForResponse,
  schema: RecordSchema,
  task: (
    field: KintoneRecordField.OneOf,
    fieldSchema: FieldSchema
  ) => Promise<Fields.OneOf>
) => Promise<LocalRecord> = async (record, schema, task) => {
  const newRecord: LocalRecord = {};
  // This step filters fields implicitly
  for (const fieldSchema of schema.fields) {
    if (!(fieldSchema.code in record)) {
      throw new Error(`The response is missing a field (${fieldSchema.code})`);
    }
    newRecord[fieldSchema.code] = await task(
      record[fieldSchema.code],
      fieldSchema
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
  }
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
            fileInfo.name
          );

          const savedFilePath = await downloadAndSaveFile(
            apiClient,
            fileInfo.fileKey,
            localFilePath
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
          row.value
        )) {
          fieldsInRow[fieldCodeInSubtable] = await fieldProcessorInSubtable(
            recordId,
            row.id,
            rowIndex,
            fieldCodeInSubtable,
            fieldInSubtable,
            { apiClient, attachmentsDir }
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
  }
) => Promise<Fields.InSubtable> = async (
  recordId,
  rowId,
  rowIndex,
  fieldCode,
  field,
  options
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
            fileInfo.name
          );

          const savedFilePath = await downloadAndSaveFile(
            apiClient,
            fileInfo.fileKey,
            localFilePath
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
  localFilePath: string
) => Promise<string> = async (apiClient, fileKey, localFilePath) => {
  const file = await apiClient.file.downloadFile({
    fileKey,
  });
  return saveFileWithoutOverwrite(localFilePath, file);
};

const saveFileWithoutOverwrite: (
  filePath: string,
  file: ArrayBuffer
) => string = (filePath, file) => {
  const uniqueFilePath = generateUniqueLocalFilePath(filePath);
  mkdirSync(path.dirname(uniqueFilePath), { recursive: true });
  writeFileSync(uniqueFilePath, Buffer.from(file));
  return uniqueFilePath;
};

const generateUniqueLocalFilePath: (filePath: string) => string = (
  filePath
) => {
  const internal: (index: number) => string = (index) => {
    const newFileName =
      index === 0
        ? path.basename(filePath)
        : `${path.basename(
            filePath,
            path.extname(filePath)
          )} (${index})${path.extname(filePath)}`;
    const newFilePath = path.join(path.dirname(filePath), newFileName);
    if (existsSync(newFilePath)) {
      return internal(index + 1);
    }
    return newFilePath;
  };
  return internal(0);
};

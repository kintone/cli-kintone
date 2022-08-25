import type { KintoneRecordForParameter } from "../../../../kintone/types";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../../types/record";
import type * as Fields from "../../types/field";
import type { FieldSchema, RecordSchema } from "../../types/schema";

import path from "path";

export const recordReducer: (
  record: KintoneRecord,
  schema: RecordSchema,
  task: (
    field: Fields.OneOf,
    fieldSchema: FieldSchema
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter> = async (record, schema, task) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const fieldSchema of schema.fields) {
    if (fieldSchema.code in record) {
      newRecord[fieldSchema.code] = await task(
        record[fieldSchema.code],
        fieldSchema
      );
    }
  }
  return newRecord;
};

export const fieldProcessor: (
  apiClient: KintoneRestAPIClient,
  field: Fields.OneOf,
  fieldSchema: FieldSchema,
  options: { attachmentsDir?: string }
) => Promise<KintoneRecordForParameter[string]> = async (
  apiClient,
  field,
  fieldSchema,
  options
) => {
  const { attachmentsDir } = options;

  switch (fieldSchema.type) {
    case "FILE": {
      if (!attachmentsDir) {
        throw new Error("--attachments-dir option is required.");
      }
      const uploadedList: Array<{ fileKey: string }> = [];
      for (const fileInfo of (field as Fields.File).value) {
        if (!fileInfo.localFilePath) {
          throw new Error("local file path not defined.");
        }
        const { fileKey } = await apiClient.file.uploadFile({
          file: {
            path: path.join(attachmentsDir, fileInfo.localFilePath),
          },
        });
        uploadedList.push({
          fileKey,
        });
      }
      return {
        value: uploadedList,
      };
    }
    case "SUBTABLE": {
      const newRows = [];

      const subtableValue = (field as Fields.Subtable).value;
      for (const row of subtableValue) {
        const fieldsInRow: KintoneRecordForParameter = {};
        for (const fieldInSubtableSchema of fieldSchema.fields) {
          if (row.value[fieldInSubtableSchema.code]) {
            fieldsInRow[fieldInSubtableSchema.code] = await fieldProcessor(
              apiClient,
              row.value[fieldInSubtableSchema.code],
              fieldInSubtableSchema,
              { attachmentsDir }
            );
          }
        }
        newRows.push({ id: row.id, value: fieldsInRow });
      }
      return {
        value: newRows,
      };
    }
    default:
      return field;
  }
};

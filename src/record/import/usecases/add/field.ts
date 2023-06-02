import type { KintoneRecordForParameter } from "../../../../kintone/types";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type * as Fields from "../../types/field";
import type { FieldSchema } from "../../types/schema";
import path from "path";

export const fieldProcessor: (
  apiClient: KintoneRestAPIClient,
  field: Fields.OneOf,
  fieldSchema: FieldSchema,
  options: { attachmentsDir?: string; skipMissingFields: boolean }
) => Promise<KintoneRecordForParameter[string]> = async (
  apiClient,
  field,
  fieldSchema,
  { attachmentsDir, skipMissingFields }
) => {
  switch (fieldSchema.type) {
    case "FILE": {
      if (!attachmentsDir) {
        throw new Error("--attachments-dir option is required.");
      }
      return fileFileldProcessor(field, apiClient, attachmentsDir);
    }
    case "SUBTABLE": {
      return subtableFieldProcessor(
        field,
        fieldSchema,
        skipMissingFields,
        apiClient,
        attachmentsDir
      );
    }
    default:
      return field;
  }
};

const fileFileldProcessor = async (
  field: Fields.OneOf,
  apiClient: KintoneRestAPIClient,
  attachmentsDir: string
) => {
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
};

const subtableFieldProcessor = async (
  field: Fields.OneOf,
  fieldSchema: FieldSchema,
  skipMissingFields: boolean,
  apiClient: KintoneRestAPIClient,
  attachmentsDir?: string
) => {
  const newRows = [];

  const subtableValue = (field as Fields.Subtable).value;
  for (const row of subtableValue) {
    const fieldsInRow: KintoneRecordForParameter = {};
    for (const fieldInSubtableSchema of fieldSchema.fields) {
      if (!row.value[fieldInSubtableSchema.code]) {
        if (skipMissingFields) {
          continue;
        } else {
          throw new Error(
            `The specified field "${fieldInSubtableSchema.code}" does not exist on the CSV`
          );
        }
      }
      fieldsInRow[fieldInSubtableSchema.code] = await fieldProcessor(
        apiClient,
        row.value[fieldInSubtableSchema.code],
        fieldInSubtableSchema,
        { attachmentsDir, skipMissingFields }
      );
    }
    newRows.push({ id: row.id, value: fieldsInRow });
  }
  return {
    value: newRows,
  };
};

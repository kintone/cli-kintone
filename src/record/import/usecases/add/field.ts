import type { KintoneRecordForParameter } from "../../../../kintone/types";
import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { KintoneRestAPIError } from "@kintone/rest-api-client";
import type * as Fields from "../../types/field";
import type { FieldSchema } from "../../types/schema";
import path from "path";
import { retry } from "../../../../utils/retry";
import { logger } from "../../../../utils/log";

export const fieldProcessor: (
  apiClient: KintoneRestAPIClient,
  field: Fields.OneOf,
  fieldSchema: FieldSchema,
  options: { attachmentsDir?: string; skipMissingFields: boolean },
) => Promise<KintoneRecordForParameter[string]> = async (
  apiClient,
  field,
  fieldSchema,
  { attachmentsDir, skipMissingFields },
) => {
  switch (fieldSchema.type) {
    case "FILE": {
      if (!attachmentsDir) {
        throw new Error("--attachments-dir option is required.");
      }
      return fileFieldProcessor(
        field as Fields.File,
        apiClient,
        attachmentsDir,
      );
    }
    case "SUBTABLE": {
      return subtableFieldProcessor(
        field as Fields.Subtable,
        fieldSchema,
        skipMissingFields,
        apiClient,
        attachmentsDir,
      );
    }
    default:
      return field;
  }
};

const fileFieldProcessor = async (
  field: Fields.File,
  apiClient: KintoneRestAPIClient,
  attachmentsDir: string,
) => {
  const uploadedList: Array<{ fileKey: string }> = [];
  for (const fileInfo of field.value) {
    if (!fileInfo.localFilePath) {
      throw new Error("local file path not defined.");
    }
    const { fileKey } = await retry(
      () =>
        apiClient.file.uploadFile({
          file: {
            path: path.join(attachmentsDir, fileInfo.localFilePath),
          },
        }),
      {
        onError: (e, attemptCount, nextDelay) => {
          logger.warn(
            "Failed to upload attachment file due to an error on kintone",
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

    uploadedList.push({
      fileKey,
    });
  }
  return {
    value: uploadedList,
  };
};

const subtableFieldProcessor = async (
  field: Fields.Subtable,
  fieldSchema: Extract<FieldSchema, { type: "SUBTABLE" }>,
  skipMissingFields: boolean,
  apiClient: KintoneRestAPIClient,
  attachmentsDir?: string,
) => {
  const newRows = [];

  const subtableValue = field.value;
  for (const row of subtableValue) {
    const fieldsInRow: KintoneRecordForParameter = {};
    for (const fieldInSubtableSchema of fieldSchema.fields) {
      if (!row.value[fieldInSubtableSchema.code]) {
        if (skipMissingFields) {
          continue;
        } else {
          throw new Error(
            `The specified field "${fieldInSubtableSchema.code}" does not exist on the CSV`,
          );
        }
      }
      fieldsInRow[fieldInSubtableSchema.code] = await fieldProcessor(
        apiClient,
        row.value[fieldInSubtableSchema.code],
        fieldInSubtableSchema,
        { attachmentsDir, skipMissingFields },
      );
    }
    newRows.push({ id: row.id, value: fieldsInRow });
  }
  return {
    value: newRows,
  };
};

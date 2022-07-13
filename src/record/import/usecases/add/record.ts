import { KintoneRecordForParameter } from "../../../../kintone/types";
import {
  KintoneFormFieldProperty,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import { KintoneRecord } from "../../types/record";
import * as Fields from "../../types/field";
import path from "path";

export const recordReducer: (
  record: KintoneRecord,
  task: (
    fieldCode: string,
    field: Fields.OneOf
  ) => Promise<KintoneRecordForParameter[string]>
) => Promise<KintoneRecordForParameter> = async (record, task) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const [fieldCode, field] of Object.entries(record)) {
    newRecord[fieldCode] = await task(fieldCode, field);
  }
  return newRecord;
};

export const fieldProcessor: (
  apiClient: KintoneRestAPIClient,
  fieldCode: string,
  field: Fields.OneOf,
  properties: Record<string, KintoneFormFieldProperty.OneOf>,
  options: { attachmentsDir?: string }
) => Promise<KintoneRecordForParameter[string]> = async (
  apiClient,
  fieldCode,
  field,
  properties,
  options
) => {
  const { attachmentsDir } = options;

  // TODO: filter fields

  switch (properties[fieldCode].type) {
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
        for (const [fieldCodeInSubtable, fieldInSubtable] of Object.entries(
          row.value
        )) {
          fieldsInRow[fieldCodeInSubtable] = await fieldProcessor(
            apiClient,
            fieldCodeInSubtable,
            fieldInSubtable,
            (
              properties[fieldCode] as KintoneFormFieldProperty.Subtable<{
                [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
              }>
            ).fields,
            { attachmentsDir }
          );
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

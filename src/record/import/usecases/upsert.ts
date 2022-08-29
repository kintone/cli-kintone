import type {
  KintoneFormFieldProperty,
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../../../kintone/types";
import type { FieldSchema, RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";

export const upsertRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKey: string,
  options: {
    attachmentsDir?: string;
    skipMissingFields?: boolean;
  }
) => Promise<void> = async (
  apiClient,
  app,
  records,
  schema,
  updateKey,
  { attachmentsDir, skipMissingFields = true }
) => {
  validateUpdateKey(schema, updateKey);

  const kintoneRecords = await convertRecordsToApiRequestParameter(
    apiClient,
    app,
    records,
    schema,
    updateKey,
    {
      attachmentsDir,
      skipMissingFields,
    }
  );

  await uploadToKintone(apiClient, app, kintoneRecords);
};

const validateUpdateKey = (schema: RecordSchema, updateKey: string) => {
  const updateKeySchema = schema.fields.find(
    (fieldSchema) => fieldSchema.code === updateKey
  );

  if (updateKeySchema === undefined) {
    throw new Error("no such update key");
  }

  if (!isSupportedUpdateKeyFieldType(updateKeySchema)) {
    throw new Error("unsupported field type for update key");
  }

  if (!updateKeySchema.unique) {
    throw new Error("update key field should set to unique");
  }
};

const isSupportedUpdateKeyFieldType = (
  fieldSchema: FieldSchema
): fieldSchema is
  | KintoneFormFieldProperty.SingleLineText
  | KintoneFormFieldProperty.Number => {
  const supportedUpdateKeyFieldTypes = ["SINGLE_LINE_TEXT", "NUMBER"];
  return supportedUpdateKeyFieldTypes.includes(fieldSchema.type);
};

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKey: string,
  options: {
    attachmentsDir?: string;
    skipMissingFields: boolean;
  }
): Promise<{
  forAdd: KintoneRecordForParameter[];
  forUpdate: KintoneRecordForUpdateParameter[];
}> => {
  const { attachmentsDir, skipMissingFields } = options;
  const recordsOnKintone = await apiClient.record.getAllRecords({
    app,
    fields: [updateKey],
  });
  const existingUpdateKeyValues = new Set(
    recordsOnKintone.map(
      (record) =>
        (
          record[updateKey] as
            | KintoneRecordField.SingleLineText
            | KintoneRecordField.Number
        ).value
    )
  );

  const kintoneRecordsForAdd: KintoneRecordForParameter[] = [];
  const kintoneRecordsForUpdate: KintoneRecordForUpdateParameter[] = [];
  for (const record of records) {
    const kintoneRecord = await recordReducer(
      record,
      schema,
      skipMissingFields,
      (field, fieldSchema) =>
        fieldProcessor(apiClient, field, fieldSchema, {
          attachmentsDir,
        })
    );
    if (record[updateKey] === undefined) {
      throw new Error(
        `The field specified as "Key to Bulk Update" (${updateKey}) does not exist on input`
      );
    }
    if (existingUpdateKeyValues.has(record[updateKey].value as string)) {
      const recordUpdateKey = {
        field: updateKey,
        value: kintoneRecord[updateKey].value as string | number,
      };
      delete kintoneRecord[updateKey];
      kintoneRecordsForUpdate.push({
        updateKey: recordUpdateKey,
        record: kintoneRecord,
      });
    } else {
      kintoneRecordsForAdd.push(kintoneRecord);
    }
  }
  return { forAdd: kintoneRecordsForAdd, forUpdate: kintoneRecordsForUpdate };
};

const uploadToKintone = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  kintoneRecords: {
    forAdd: KintoneRecordForParameter[];
    forUpdate: KintoneRecordForUpdateParameter[];
  }
) => {
  if (kintoneRecords.forUpdate.length > 0) {
    try {
      await apiClient.record.updateAllRecords({
        app,
        records: kintoneRecords.forUpdate,
      });
      console.log(
        `SUCCESS: update records[${kintoneRecords.forUpdate.length}]`
      );
    } catch (e) {
      console.log(`FAILED: update records[${kintoneRecords.forUpdate.length}]`);
      throw e;
    }
  }
  if (kintoneRecords.forAdd.length > 0) {
    try {
      await apiClient.record.addAllRecords({
        app,
        records: kintoneRecords.forAdd,
      });
      console.log(`SUCCESS: add records[${kintoneRecords.forAdd.length}]`);
    } catch (e) {
      console.log(`FAILED: add records[${kintoneRecords.forAdd.length}]`);
      throw e;
    }
  }
};

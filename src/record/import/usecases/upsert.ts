import type {
  KintoneRecordField,
  KintoneRestAPIClient,
} from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { findUpdateKeyInSchema } from "./upsert/updateKey";

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
  const updateKeyInSchema = findUpdateKeyInSchema(updateKey, schema);

  const kintoneRecords = await convertRecordsToApiRequestParameter(
    apiClient,
    app,
    records,
    schema,
    updateKeyInSchema,
    {
      attachmentsDir,
      skipMissingFields,
    }
  );

  await uploadToKintone(apiClient, app, kintoneRecords);
};

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKey: {
    code: string;
    type: string;
  },
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
    fields: [updateKey.code],
  });
  const existingUpdateKeyValues = new Set(
    recordsOnKintone.map(
      (record) =>
        (
          record[updateKey.code] as
            | KintoneRecordField.RecordNumber
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
          skipMissingFields,
        })
    );
    if (record[updateKey.code] === undefined) {
      throw new Error(
        `The field specified as "Key to Bulk Update" (${updateKey.code}) does not exist on input`
      );
    }
    if (existingUpdateKeyValues.has(record[updateKey.code].value as string)) {
      const recordUpdateKey = {
        field: updateKey.code,
        value: kintoneRecord[updateKey.code].value as string,
      };
      delete kintoneRecord[updateKey.code];
      const recordForUpdate =
        updateKey.type === "RECORD_NUMBER"
          ? {
              id: recordUpdateKey.value,
              record: kintoneRecord,
            }
          : {
              updateKey: recordUpdateKey,
              record: kintoneRecord,
            };
      kintoneRecordsForUpdate.push(recordForUpdate);
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

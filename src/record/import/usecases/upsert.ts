import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import {
  findUpdateKeyInSchema,
  removeAppCode,
  validateUpdateKeyInRecords,
} from "./upsert/updateKey";

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

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKeyCode: string,
  options: {
    attachmentsDir?: string;
    skipMissingFields: boolean;
  }
): Promise<{
  forAdd: KintoneRecordForParameter[];
  forUpdate: KintoneRecordForUpdateParameter[];
}> => {
  const { attachmentsDir, skipMissingFields } = options;

  const updateKey = findUpdateKeyInSchema(updateKeyCode, schema);
  const appCode = (await apiClient.app.getApp({ id: app })).code;
  validateUpdateKeyInRecords(updateKey, appCode, records);

  const recordsOnKintone = await apiClient.record.getAllRecords({
    app,
    fields: [updateKey.code],
  });
  const existingUpdateKeyValues = new Set(
    recordsOnKintone.map((record) => {
      const updateKeyValue = record[updateKey.code].value as string;
      if (updateKey.type === "RECORD_NUMBER") {
        return removeAppCode(updateKeyValue, appCode);
      }
      return updateKeyValue;
    })
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
    const updateKeyValue =
      updateKey.type === "RECORD_NUMBER"
        ? removeAppCode(record[updateKey.code].value as string, appCode)
        : (record[updateKey.code].value as string);
    if (existingUpdateKeyValues.has(updateKeyValue)) {
      delete kintoneRecord[updateKey.code];
      const recordForUpdate =
        updateKey.type === "RECORD_NUMBER"
          ? {
              id: updateKeyValue,
              record: kintoneRecord,
            }
          : {
              updateKey: { field: updateKey.code, value: updateKeyValue },
              record: kintoneRecord,
            };
      kintoneRecordsForUpdate.push(recordForUpdate);
    } else {
      if (updateKey.type === "RECORD_NUMBER") {
        delete kintoneRecord[updateKey.code];
      }
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

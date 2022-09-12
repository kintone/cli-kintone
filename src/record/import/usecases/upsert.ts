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
  UpdateKey,
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

type RecordAsRequestParameter =
  | {
      type: "add";
      record: KintoneRecordForParameter;
    }
  | {
      type: "update";
      record: KintoneRecordForUpdateParameter;
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
): Promise<RecordAsRequestParameter[]> => {
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

  const kintoneRecords: RecordAsRequestParameter[] = [];
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

    const updateKeyValue = parseUpdateKeyValue(
      record[updateKey.code].value as string,
      updateKey,
      appCode
    );
    if (
      updateKeyValue.length > 0 &&
      existingUpdateKeyValues.has(updateKeyValue)
    ) {
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
      kintoneRecords.push({
        type: "update",
        record: recordForUpdate,
      });
    } else {
      if (updateKey.type === "RECORD_NUMBER") {
        delete kintoneRecord[updateKey.code];
      }
      kintoneRecords.push({
        type: "add",
        record: kintoneRecord,
      });
    }
  }
  return kintoneRecords;
};

const parseUpdateKeyValue = (
  input: string,
  updateKey: UpdateKey,
  appCode: string
) => {
  if (input.length === 0) {
    return input;
  }
  if (updateKey.type === "RECORD_NUMBER") {
    return removeAppCode(input, appCode);
  }
  return input;
};

const uploadToKintone = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  kintoneRecords: RecordAsRequestParameter[]
) => {
  let recordsToUploadNext:
    | {
        type: "add";
        records: KintoneRecordForParameter[];
      }
    | {
        type: "update";
        records: KintoneRecordForUpdateParameter[];
      }
    | undefined;

  const upsert = async (
    recordsToUpload:
      | { type: "add"; records: KintoneRecordForParameter[] }
      | { type: "update"; records: KintoneRecordForUpdateParameter[] }
  ) => {
    try {
      if (recordsToUpload.type === "update") {
        await apiClient.record.updateAllRecords({
          app,
          records: recordsToUpload.records,
        });
      } else {
        await apiClient.record.addAllRecords({
          app,
          records: recordsToUpload.records,
        });
      }
      console.log(`SUCCESS: import records[${recordsToUpload.records.length}]`);
    } catch (e) {
      console.log(`FAILED: import records[${recordsToUpload.records.length}]`);
      throw e;
    }
  };

  for (const record of kintoneRecords) {
    if (recordsToUploadNext && record.type !== recordsToUploadNext.type) {
      await upsert(recordsToUploadNext);
      recordsToUploadNext = undefined;
    }

    if (recordsToUploadNext === undefined) {
      recordsToUploadNext = {
        type: record.type,
        records: [record.record as any],
      };
    } else {
      recordsToUploadNext.records.push(record.record as any);
    }
  }
  if (recordsToUploadNext) {
    await upsert(recordsToUploadNext);
  }
};

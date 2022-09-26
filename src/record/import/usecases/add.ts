import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type { KintoneRecordForParameter } from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { AddRecordsError } from "./add/error";

export const addRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  options: {
    attachmentsDir?: string;
    skipMissingFields?: boolean;
  }
) => Promise<void> = async (
  apiClient,
  app,
  records,
  schema,
  { attachmentsDir, skipMissingFields = true }
) => {
  try {
    const kintoneRecords = await convertRecordsToApiRequestParameter(
      apiClient,
      app,
      records,
      schema,
      {
        attachmentsDir,
        skipMissingFields,
      }
    );
    await uploadToKintone(apiClient, app, kintoneRecords);
  } catch (e) {
    throw new AddRecordsError(e, records, 0);
  }
};

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  options: {
    attachmentsDir?: string;
    skipMissingFields: boolean;
  }
): Promise<KintoneRecordForParameter[]> => {
  const { attachmentsDir, skipMissingFields } = options;

  const kintoneRecords: KintoneRecordForParameter[] = [];
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
    kintoneRecords.push(kintoneRecord);
  }
  return kintoneRecords;
};

const uploadToKintone = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  kintoneRecords: KintoneRecordForParameter[]
) => {
  if (kintoneRecords.length > 0) {
    try {
      await apiClient.record.addAllRecords({
        app,
        records: kintoneRecords,
      });
      console.log(`SUCCESS: add records[${kintoneRecords.length}]`);
    } catch (e) {
      console.error(`FAILED: add records[${kintoneRecords.length}]`);
      throw e;
    }
  }
};

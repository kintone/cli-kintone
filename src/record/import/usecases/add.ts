import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type { KintoneRecordForParameter } from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";

export const addRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  options: {
    attachmentsDir?: string;
  }
) => Promise<void> = async (
  apiClient,
  app,
  records,
  schema,
  { attachmentsDir }
) => {
  const kintoneRecords = await convertRecordsToApiRequestParameter(
    apiClient,
    app,
    records,
    schema,
    {
      attachmentsDir,
    }
  );

  await uploadToKintone(apiClient, app, kintoneRecords);
};

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  options: {
    attachmentsDir?: string;
  }
): Promise<KintoneRecordForParameter[]> => {
  const { attachmentsDir } = options;

  const kintoneRecords: KintoneRecordForParameter[] = [];
  for (const record of records) {
    const kintoneRecord = await recordReducer(
      record,
      schema,
      (field, fieldSchema) =>
        fieldProcessor(apiClient, field, fieldSchema, {
          attachmentsDir,
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
      console.log(`FAILED: add records[${kintoneRecords.length}]`);
      throw e;
    }
  }
};

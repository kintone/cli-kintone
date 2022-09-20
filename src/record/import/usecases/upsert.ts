import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { UpdateKeyHelper } from "./upsert/updateKey";
import { UpsertRecordsError } from "./upsert/error";

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
  updateKeyCode,
  { attachmentsDir, skipMissingFields = true }
) => {
  let currentIndex = 0;
  try {
    const updateKeyHelper = await UpdateKeyHelper.build(
      apiClient,
      app,
      updateKeyCode,
      schema
    );
    updateKeyHelper.validateUpdateKeyInRecords(records);

    for (const [recordsNext, index] of recordReader(records, updateKeyHelper)) {
      currentIndex = index;
      if (recordsNext.type === "update") {
        const recordsToUpload = await convertToKintoneRecordForUpdate(
          apiClient,
          app,
          recordsNext.records,
          schema,
          updateKeyHelper,
          { attachmentsDir, skipMissingFields }
        );
        await apiClient.record.updateAllRecords({
          app,
          records: recordsToUpload,
        });
      } else {
        const recordsToUpload = await convertToKintoneRecordForAdd(
          apiClient,
          app,
          recordsNext.records,
          schema,
          updateKeyHelper,
          { attachmentsDir, skipMissingFields }
        );
        await apiClient.record.addAllRecords({
          app,
          records: recordsToUpload,
        });

        console.log(`SUCCESS: import records[${recordsNext.records.length}]`);
      }
    }
  } catch (e) {
    throw new UpsertRecordsError(e, records, currentIndex);
  }
};

const convertToKintoneRecordForUpdate = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKeyHelper: UpdateKeyHelper,
  options: {
    attachmentsDir?: string;
    skipMissingFields: boolean;
  }
): Promise<KintoneRecordForUpdateParameter[]> => {
  const { attachmentsDir, skipMissingFields } = options;

  const kintoneRecords: KintoneRecordForUpdateParameter[] = [];
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

    const updateKey = updateKeyHelper.getUpdateKey();
    const updateKeyValue = updateKeyHelper.findUpdateKeyValueFromRecord(record);

    delete kintoneRecord[updateKey.code];
    kintoneRecords.push(
      updateKey.type === "RECORD_NUMBER"
        ? {
            id: updateKeyValue,
            record: kintoneRecord,
          }
        : {
            updateKey: { field: updateKey.code, value: updateKeyValue },
            record: kintoneRecord,
          }
    );
  }

  return kintoneRecords;
};

const convertToKintoneRecordForAdd = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKeyHelper: UpdateKeyHelper,
  options: {
    attachmentsDir?: string;
    skipMissingFields: boolean;
  }
): Promise<KintoneRecordForParameter[]> => {
  const { attachmentsDir, skipMissingFields } = options;
  const updateKey = updateKeyHelper.getUpdateKey();

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

    if (updateKey.type === "RECORD_NUMBER") {
      delete kintoneRecord[updateKey.code];
    }

    kintoneRecords.push(kintoneRecord);
  }

  return kintoneRecords;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
function* recordReader(
  records: KintoneRecord[],
  updateKeyHelper: UpdateKeyHelper
): Generator<
  [{ type: "add" | "update"; records: KintoneRecord[] }, number],
  void,
  undefined
> {
  if (records.length === 0) {
    return;
  }

  let index = 0;
  while (index < records.length) {
    let last = index;
    const isUpdateCurrent = updateKeyHelper.isUpdate(records[index]);

    while (
      last + 1 < records.length &&
      updateKeyHelper.isUpdate(records[last + 1]) === isUpdateCurrent
    ) {
      last++;
    }

    yield [
      {
        type: isUpdateCurrent ? "update" : "add",
        records: records.slice(index, last + 1),
      },
      index,
    ];

    index = last + 1;
    last = index;
  }
}

import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { UpdateKey } from "./upsert/updateKey";
import { UpsertRecordsError } from "./upsert/error";
import { logger } from "../utils/log";
import { ProgressLogger } from "./add/progress";

const CHUNK_SIZE = 2000;

export const upsertRecords = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: KintoneRecord[],
  schema: RecordSchema,
  updateKeyCode: string,
  {
    attachmentsDir,
    skipMissingFields = true,
  }: { attachmentsDir?: string; skipMissingFields?: boolean }
): Promise<void> => {
  let currentIndex = 0;
  try {
    logger.info("Download all existing records from kintone");
    const updateKey = await UpdateKey.build(
      apiClient,
      app,
      updateKeyCode,
      schema
    );
    updateKey.validateUpdateKeyInRecords(records);

    logger.info("Upload all records to kintone");
    const progressLogger = new ProgressLogger(records.length);
    progressLogger.update(0);
    for (const [recordsNext, index] of recordReader(records, updateKey)) {
      currentIndex = index;
      if (recordsNext.type === "update") {
        const recordsToUpload = await convertToKintoneRecordForUpdate(
          apiClient,
          app,
          recordsNext.records,
          schema,
          updateKey,
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
          updateKey,
          { attachmentsDir, skipMissingFields }
        );
        await apiClient.record.addAllRecords({
          app,
          records: recordsToUpload,
        });
      }
      progressLogger.update(index + recordsNext.records.length);
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
  updateKey: UpdateKey,
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

    const updateKeyField = updateKey.getUpdateKeyField();
    const updateKeyValue = updateKey.findUpdateKeyValueFromRecord(record);

    delete kintoneRecord[updateKeyField.code];
    kintoneRecords.push(
      updateKeyField.type === "RECORD_NUMBER"
        ? {
            id: updateKeyValue,
            record: kintoneRecord,
          }
        : {
            updateKey: { field: updateKeyField.code, value: updateKeyValue },
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
  updateKey: UpdateKey,
  options: {
    attachmentsDir?: string;
    skipMissingFields: boolean;
  }
): Promise<KintoneRecordForParameter[]> => {
  const { attachmentsDir, skipMissingFields } = options;
  const updateKeyField = updateKey.getUpdateKeyField();

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

    if (updateKeyField.type === "RECORD_NUMBER") {
      delete kintoneRecord[updateKeyField.code];
    }

    kintoneRecords.push(kintoneRecord);
  }

  return kintoneRecords;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
function* recordReader(
  records: KintoneRecord[],
  updateKey: UpdateKey
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
    const isUpdateCurrent = updateKey.isUpdate(records[index]);

    while (
      last + 1 < records.length &&
      last - index < CHUNK_SIZE - 1 &&
      updateKey.isUpdate(records[last + 1]) === isUpdateCurrent
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

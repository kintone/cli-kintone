import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { LocalRecord } from "../types/record";
import type {
  KintoneRecordForParameter,
  KintoneRecordForUpdateParameter,
} from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor } from "./add/field";
import { recordConverter } from "./add/record";
import { UpdateKey } from "./upsert/updateKey";
import { UpsertRecordsError } from "./upsert/error";
import { logger } from "../../../utils/log";
import { ProgressLogger } from "./add/progress";
import type { LocalRecordRepository } from "./interface";
import { groupByKeyChunked } from "../../../utils/iterator";

const CHUNK_SIZE = 2000;

export const upsertRecords = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  recordSource: LocalRecordRepository,
  schema: RecordSchema,
  updateKeyCode: string,
  {
    attachmentsDir,
    skipMissingFields = true,
  }: { attachmentsDir?: string; skipMissingFields?: boolean }
): Promise<void> => {
  let currentIndex = 0;
  let currentRecords: LocalRecord[] = [];
  const progressLogger = new ProgressLogger(
    logger,
    await recordSource.length()
  );
  try {
    logger.info("Preparing to import records...");
    const updateKey = await UpdateKey.build(
      apiClient,
      app,
      updateKeyCode,
      schema
    );

    await updateKey.validateUpdateKeyInRecords(recordSource);

    logger.info("Starting to import records...");
    for await (const recordsByChunk of groupByKeyChunked(
      recordSource.reader(),
      (record) => (updateKey.isUpdate(record) ? "update" : "add"),
      CHUNK_SIZE
    )) {
      currentRecords = recordsByChunk.data;

      if (recordsByChunk.key === "update") {
        const recordsToUpload = await convertToKintoneRecordForUpdate(
          apiClient,
          app,
          recordsByChunk.data,
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
          recordsByChunk.data,
          schema,
          updateKey,
          { attachmentsDir, skipMissingFields }
        );
        await apiClient.record.addAllRecords({
          app,
          records: recordsToUpload,
        });
      }
      currentIndex += recordsByChunk.data.length;
      progressLogger.update(currentIndex);
    }
    progressLogger.done();
  } catch (e) {
    progressLogger.abort(currentIndex);
    throw new UpsertRecordsError(e, currentRecords, currentIndex, schema);
  }
};

const convertToKintoneRecordForUpdate = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: LocalRecord[],
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
    const kintoneRecord = await recordConverter(
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
  records: LocalRecord[],
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
    const kintoneRecord = await recordConverter(
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

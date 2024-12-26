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
  }: { attachmentsDir?: string; skipMissingFields?: boolean },
): Promise<void> => {
  let currentIndex = 0;
  let currentRecords: LocalRecord[] = [];
  let lastSucceededRecord: LocalRecord | undefined;
  const progressLogger = new ProgressLogger(
    logger,
    await recordSource.length(),
  );
  try {
    logger.info("Preparing to import records...");
    const updateKey = await UpdateKey.build(
      apiClient,
      app,
      updateKeyCode,
      schema,
    );

    await updateKey.validateUpdateKeyInRecords(recordSource);

    logger.info("Starting to import records...");
    for await (const recordsByChunk of groupByKeyChunked(
      recordSource.reader(),
      (record) => (updateKey.isUpdate(record) ? "update" : "add"),
      CHUNK_SIZE,
    )) {
      currentRecords = recordsByChunk.data;

      if (recordsByChunk.key === "update") {
        const recordsToUpload = await convertToKintoneRecordForUpdate(
          apiClient,
          app,
          recordsByChunk.data,
          schema,
          updateKey,
          { attachmentsDir, skipMissingFields },
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
          { attachmentsDir, skipMissingFields },
        );
        await apiClient.record.addAllRecords({
          app,
          records: recordsToUpload,
        });
      }
      currentIndex += recordsByChunk.data.length;
      lastSucceededRecord = recordsByChunk.data.slice(-1)[0];
      progressLogger.update(currentIndex);
    }
    progressLogger.done();
  } catch (e) {
    progressLogger.abort(currentIndex);
    throw new UpsertRecordsError(
      e,
      currentRecords,
      currentIndex,
      schema,
      lastSucceededRecord,
    );
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
  },
): Promise<KintoneRecordForUpdateParameter[]> => {
  const { attachmentsDir, skipMissingFields } = options;

  const updateKeyField = updateKey.getUpdateKeyField();

  // Ignore the following fields
  // - Record number field
  // - Non-updatable fields
  //   - Created by
  //   - Created datetime
  //   - Updated by
  //   - Updated datetime
  // - The field specified as "Key to Bulk Update"
  const fieldCodesToBeIgnored = schema.fields
    .filter(
      (fieldSchema) =>
        fieldSchema.type === "RECORD_NUMBER" ||
        fieldSchema.type === "CREATOR" ||
        fieldSchema.type === "CREATED_TIME" ||
        fieldSchema.type === "MODIFIER" ||
        fieldSchema.type === "UPDATED_TIME",
    )
    .map((fieldSchema) => fieldSchema.code)
    .concat(updateKeyField.code);

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
        }),
    );

    const updateKeyValue = updateKey.findUpdateKeyValueFromRecord(record);

    for (const fieldCode of fieldCodesToBeIgnored) {
      delete kintoneRecord[fieldCode];
    }

    kintoneRecords.push(
      updateKeyField.type === "RECORD_NUMBER"
        ? {
            id: updateKeyValue,
            record: kintoneRecord,
          }
        : {
            updateKey: { field: updateKeyField.code, value: updateKeyValue },
            record: kintoneRecord,
          },
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
  },
): Promise<KintoneRecordForParameter[]> => {
  const { attachmentsDir, skipMissingFields } = options;

  // Ignore a Record number field
  const recordNumberFieldCode = schema.fields.find(
    (fieldSchema) => fieldSchema.type === "RECORD_NUMBER",
  )?.code;

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
        }),
    );

    if (recordNumberFieldCode !== undefined) {
      delete kintoneRecord[recordNumberFieldCode];
    }

    kintoneRecords.push(kintoneRecord);
  }

  return kintoneRecords;
};

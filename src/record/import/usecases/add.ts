import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { LocalRecord } from "../types/record";
import type { KintoneRecordForParameter } from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { AddRecordsError } from "./add/error";
import { logger } from "../../../utils/log";
import { ProgressLogger } from "./add/progress";
import type { LocalRecordRepository } from "./interface";

const CHUNK_SIZE = 2000;

export const addRecords: (
  apiClient: KintoneRestAPIClient,
  app: string,
  recordSource: LocalRecordRepository,
  schema: RecordSchema,
  options: {
    attachmentsDir?: string;
    skipMissingFields?: boolean;
  }
) => Promise<void> = async (
  apiClient,
  app,
  recordSource: LocalRecordRepository,
  schema,
  { attachmentsDir, skipMissingFields = true }
) => {
  let currentIndex = 0;
  let currentRecords: LocalRecord[] = [];
  const progressLogger = new ProgressLogger(
    logger,
    await recordSource.length()
  );
  try {
    logger.info("Starting to import records...");
    for await (const [recordsNext, index] of recordsReader(recordSource)) {
      currentIndex = index;
      currentRecords = recordsNext;
      const recordsToUpload = await convertRecordsToApiRequestParameter(
        apiClient,
        app,
        recordsNext,
        schema,
        {
          attachmentsDir,
          skipMissingFields,
        }
      );
      await apiClient.record.addAllRecords({
        app,
        records: recordsToUpload,
      });
      progressLogger.update(index + recordsNext.length);
    }
    progressLogger.done();
  } catch (e) {
    progressLogger.abort(currentIndex);
    throw new AddRecordsError(e, currentRecords, currentIndex, schema);
  }
};

const convertRecordsToApiRequestParameter = async (
  apiClient: KintoneRestAPIClient,
  app: string,
  records: LocalRecord[],
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
async function* recordsReader(
  localRecordReader: LocalRecordRepository
): AsyncGenerator<[LocalRecord[], number], void, undefined> {
  let records = [];
  let currentIndex = 0;
  for await (const localRecord of localRecordReader.reader()) {
    records.push(localRecord);
    if (records.length >= CHUNK_SIZE) {
      yield [records, currentIndex];
      records = [];
      currentIndex = localRecord.metadata.recordIndex;
    }
  }
  if (records.length > 0) {
    yield [records, currentIndex];
  }
}

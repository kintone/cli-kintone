import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { KintoneRecord } from "../types/record";
import type { KintoneRecordForParameter } from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { AddRecordsError } from "./add/error";
import { logger } from "../utils/log";
import { ProgressLogger } from "./add/progress";

const CHUNK_SIZE = 2000;

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
  let currentIndex = 0;
  const progressLogger = new ProgressLogger(logger, records.length);
  try {
    logger.info("Starting to import records...");
    for (const [recordsNext, index] of recordReader(records)) {
      currentIndex = index;
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
    throw new AddRecordsError(e, records, currentIndex);
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
function* recordReader(
  records: KintoneRecord[]
): Generator<[KintoneRecord[], number], void, undefined> {
  if (records.length === 0) {
    return;
  }

  let index = 0;
  while (index < records.length) {
    const last = Math.min(index + CHUNK_SIZE - 1, records.length - 1);

    yield [records.slice(index, last + 1), index];

    index = last + 1;
  }
}

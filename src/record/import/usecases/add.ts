import type { KintoneRestAPIClient } from "@kintone/rest-api-client";
import type { LocalRecord } from "../types/record";
import type { KintoneRecordForParameter } from "../../../kintone/types";
import type { RecordSchema } from "../types/schema";

import { fieldProcessor, recordReducer } from "./add/record";
import { AddRecordsError } from "./add/error";
import { logger } from "../../../utils/log";
import { ProgressLogger } from "./add/progress";
import type { LocalRecordRepository } from "./interface";
import { chunked } from "../utils/iterator";

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
    for await (const recordsByChunk of chunked(
      recordSource.reader(),
      CHUNK_SIZE
    )) {
      currentRecords = recordsByChunk;
      const recordsToUpload = await convertRecordsToApiRequestParameter(
        apiClient,
        app,
        recordsByChunk,
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
      currentIndex += recordsByChunk.length;
      progressLogger.update(currentIndex);
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

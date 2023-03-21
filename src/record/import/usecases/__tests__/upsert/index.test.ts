import type { LocalRecord } from "../../../types/record.js";
import type { RecordSchema } from "../../../types/schema.js";

import { jest } from "@jest/globals";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { upsertRecords } from "../../upsert.js";

import { pattern as upsertByRecordNumber } from "./fixtures/upsertByRecordNumber/index.js";
import { pattern as upsertByRecordNumberWithAppCode } from "./fixtures/upsertByRecordNumberWithAppCode/index.js";
import { pattern as upsertByRecordNumberWithAppCodeOnKintone } from "./fixtures/upsertByRecordNumberWithAppCodeOnKintone/index.js";
import { pattern as upsertBySingleLineText } from "./fixtures/upsertByNumber/index.js";
import { pattern as upsertByNumber } from "./fixtures/upsertBySingleLineText/index.js";
import { pattern as upsertRecordsSequentially } from "./fixtures/upsertRecordsSequentially/index.js";
import { pattern as upsertByNonUniqueKey } from "./fixtures/upsertByNonUniqueKey/index.js";
import { pattern as upsertByUnsupportedField } from "./fixtures/upsertByUnsupportedField/index.js";
import { pattern as upsertByNonExistentField } from "./fixtures/upsertByNonExistentField/index.js";
import { pattern as upsertWithMissingKeyFromRecord } from "./fixtures/upsertWithMissingKeyFromRecord/index.js";
import { pattern as upsertWithMissingFieldFromRecord } from "./fixtures/upsertWithMissingFieldFromRecord/index.js";
import { pattern as upsertWithMissingFieldInTableFromRecord } from "./fixtures/upsertWithMissingFieldInTableFromRecord/index.js";
import { pattern as upsertByRecordNumberWithMixedRecordNumber } from "./fixtures/upsertByRecordNumberWithInvalidRecordNumber/index.js";
import { pattern as upsertByRecordNumberWithInvalidRecordNumber } from "./fixtures/upsertByRecordNumberWithMixedRecordNumber/index.js";
import { UpsertRecordsError } from "../../upsert/error.js";
import type { LocalRecordRepository } from "../../interface.js";

export type TestPattern = {
  description: string;
  input: {
    records: LocalRecord[];
    repository: LocalRecordRepository;
    schema: RecordSchema;
    updateKey: string;
    options: {
      attachmentsDir?: string;
      skipMissingFields?: boolean;
    };
  };
  recordsOnKintone: Awaited<
    ReturnType<KintoneRestAPIClient["record"]["getAllRecords"]>
  >;
  expected: {
    success?: {
      requests: Array<
        | {
            type: "update";
            payload: Parameters<
              KintoneRestAPIClient["record"]["updateAllRecords"]
            >[0];
          }
        | {
            type: "add";
            payload: Parameters<
              KintoneRestAPIClient["record"]["addAllRecords"]
            >[0];
          }
      >;
    };
    failure?: {
      cause: unknown;
    };
  };
};

describe("upsertRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  const patterns = [
    upsertByRecordNumber,
    upsertByRecordNumberWithAppCode,
    upsertByRecordNumberWithAppCodeOnKintone,
    upsertBySingleLineText,
    upsertByNumber,
    upsertRecordsSequentially,
    upsertByNonUniqueKey,
    upsertByUnsupportedField,
    upsertByNonExistentField,
    upsertWithMissingKeyFromRecord,
    upsertWithMissingFieldFromRecord,
    upsertWithMissingFieldInTableFromRecord,
    upsertByRecordNumberWithMixedRecordNumber,
    upsertByRecordNumberWithInvalidRecordNumber,
  ];

  it.each(patterns)(
    "$description",
    async ({ input, recordsOnKintone, expected }) => {
      apiClient.record.getAllRecords = jest
        .fn<() => Promise<any>>()
        .mockResolvedValue(recordsOnKintone);
      const updateAllRecordsMockFn = jest
        .fn<() => Promise<any>>()
        .mockResolvedValue({
          records: [
            {
              id: "1",
              revision: "2",
            },
          ],
        });
      apiClient.record.updateAllRecords = updateAllRecordsMockFn;
      const addAllRecordsMockFn = jest
        .fn<() => Promise<any>>()
        .mockResolvedValue({});
      apiClient.record.addAllRecords = addAllRecordsMockFn;
      apiClient.app.getApp = jest
        .fn<() => Promise<any>>()
        .mockResolvedValue({ code: "App" });

      const APP_ID = "1";

      if (expected.success !== undefined) {
        await upsertRecords(
          apiClient,
          APP_ID,
          input.repository,
          input.schema,
          input.updateKey,
          input.options
        );
        for (const request of expected.success.requests) {
          if (request.type === "update") {
            expect(updateAllRecordsMockFn).toBeCalledWith(request.payload);
          } else {
            expect(addAllRecordsMockFn).toBeCalledWith(request.payload);
          }
        }
      }
      if (expected.failure !== undefined) {
        await expect(
          upsertRecords(
            apiClient,
            APP_ID,
            input.repository,
            input.schema,
            input.updateKey,
            input.options
          )
        ).rejects.toThrow(
          new UpsertRecordsError(
            expected.failure.cause,
            input.records,
            0,
            input.schema
          )
        );
      }
    }
  );
});

import type { KintoneRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { upsertRecords } from "../../upsert";

import { pattern as upsertByRecordNumber } from "./fixtures/upsertByRecordNumber";
import { pattern as upsertByRecordNumberWithAppCode } from "./fixtures/upsertByRecordNumberWithAppCode";
import { pattern as upsertByRecordNumberWithAppCodeOnKintone } from "./fixtures/upsertByRecordNumberWithAppCodeOnKintone";
import { pattern as upsertBySingleLineText } from "./fixtures/upsertByNumber";
import { pattern as upsertByNumber } from "./fixtures/upsertBySingleLineText";
import { pattern as upsertRecordsSequentially } from "./fixtures/upsertRecordsSequentially";
import { pattern as upsertByNonUniqueKey } from "./fixtures/upsertByNonUniqueKey";
import { pattern as upsertByUnsupportedField } from "./fixtures/upsertByUnsupportedField";
import { pattern as upsertByNonExistentField } from "./fixtures/upsertByNonExistentField";
import { pattern as upsertWithMissingKeyFromRecord } from "./fixtures/upsertWithMissingKeyFromRecord";
import { pattern as upsertWithMissingFieldFromRecord } from "./fixtures/upsertWithMissingFieldFromRecord";
import { pattern as upsertWithMissingFieldInTableFromRecord } from "./fixtures/upsertWithMissingFieldInTableFromRecord";
import { pattern as upsertByRecordNumberWithMixedRecordNumber } from "./fixtures/upsertByRecordNumberWithMixedRecordNumber";
import { pattern as upsertByRecordNumberWithInvalidRecordNumber } from "./fixtures/upsertByRecordNumberWithInvalidRecordNumber";
import { UpsertRecordsError } from "../../upsert/error";

export type TestPattern = {
  description: string;
  input: {
    records: KintoneRecord[];
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
      errorMessage: string;
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
      const getAllRecordsMockFn = jest.fn().mockResolvedValue(recordsOnKintone);
      apiClient.record.getAllRecords = getAllRecordsMockFn;
      const updateAllRecordsMockFn = jest.fn().mockResolvedValue({
        records: [
          {
            id: "1",
            revision: "2",
          },
        ],
      });
      apiClient.record.updateAllRecords = updateAllRecordsMockFn;
      const addAllRecordsMockFn = jest.fn().mockResolvedValue({});
      apiClient.record.addAllRecords = addAllRecordsMockFn;
      apiClient.app.getApp = jest.fn().mockResolvedValue({ code: "App" });

      const APP_ID = "1";

      if (expected.success !== undefined) {
        await upsertRecords(
          apiClient,
          APP_ID,
          input.records,
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
            input.records,
            input.schema,
            input.updateKey,
            input.options
          )
        ).rejects.toThrow(
          new UpsertRecordsError(
            expected.failure.errorMessage,
            input.records,
            0
          )
        );
      }
    }
  );
});

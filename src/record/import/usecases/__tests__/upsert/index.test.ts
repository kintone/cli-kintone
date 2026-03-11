import { vi } from "vitest";
import type { LocalRecord } from "../../../types/record.js";
import type { RecordSchema } from "../../../types/schema.js";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { upsertRecords } from "../../upsert.js";

import { pattern as upsertByRecordNumber } from "./fixtures/upsertByRecordNumber/index.js";
import { pattern as upsertByRecordNumberWithAppCode } from "./fixtures/upsertByRecordNumberWithAppCode/index.js";
import { pattern as upsertByRecordNumberWithAppCodeOnKintone } from "./fixtures/upsertByRecordNumberWithAppCodeOnKintone/index.js";
import { pattern as upsertBySingleLineText } from "./fixtures/upsertByNumber/index.js";
import { pattern as upsertByNumber } from "./fixtures/upsertBySingleLineText/index.js";
import { pattern as upsertByNonUniqueKey } from "./fixtures/upsertByNonUniqueKey/index.js";
import { pattern as upsertByUnsupportedField } from "./fixtures/upsertByUnsupportedField/index.js";
import { pattern as upsertByNonExistentField } from "./fixtures/upsertByNonExistentField/index.js";
import { pattern as upsertWithMissingKeyFromRecord } from "./fixtures/upsertWithMissingKeyFromRecord/index.js";
import { pattern as upsertWithMissingFieldFromRecord } from "./fixtures/upsertWithMissingFieldFromRecord/index.js";
import { pattern as upsertWithMissingFieldInTableFromRecord } from "./fixtures/upsertWithMissingFieldInTableFromRecord/index.js";
import { pattern as upsertByRecordNumberWithMixedRecordNumber } from "./fixtures/upsertByRecordNumberWithInvalidRecordNumber/index.js";
import { pattern as upsertByRecordNumberWithInvalidRecordNumber } from "./fixtures/upsertByRecordNumberWithMixedRecordNumber/index.js";

import { UpsertRecordsError } from "../../upsert/error.js";
import { LocalRecordRepositoryMock } from "../../../repositories/localRecordRepositoryMock.js";

export type TestPattern = {
  description: string;
  input: {
    repository: {
      source: LocalRecord[];
      format: string;
    };
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
      requests: Array<{
        type: "update";
        payload: Parameters<
          KintoneRestAPIClient["record"]["updateAllRecords"]
        >[0];
      }>;
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
      const getAllRecordsMockFn = vi.fn().mockResolvedValue(recordsOnKintone);
      apiClient.record.getAllRecords = getAllRecordsMockFn;
      const updateAllRecordsMockFn = vi.fn().mockResolvedValue({
        records: [
          {
            id: "1",
            revision: "2",
          },
        ],
      });
      apiClient.record.updateAllRecords = updateAllRecordsMockFn;
      apiClient.app.getApp = vi.fn().mockResolvedValue({ code: "App" });

      const APP_ID = "1";
      const createRepository = () =>
        new LocalRecordRepositoryMock(
          input.repository.source,
          input.repository.format,
        );

      if (expected.success !== undefined) {
        await upsertRecords(
          apiClient,
          APP_ID,
          createRepository(),
          input.schema,
          input.updateKey,
          input.options,
        );
        for (const request of expected.success.requests) {
          expect(updateAllRecordsMockFn).toBeCalledWith(request.payload);
        }
      }
      if (expected.failure !== undefined) {
        const { cause } = expected.failure;
        await expect(
          upsertRecords(
            apiClient,
            APP_ID,
            createRepository(),
            input.schema,
            input.updateKey,
            input.options,
          ),
        ).rejects.toSatisfy((error) => {
          expect(error).toBeInstanceOf(UpsertRecordsError);
          expect(error).toMatchObject({ cause });
          return true;
        });
      }
    },
  );
});

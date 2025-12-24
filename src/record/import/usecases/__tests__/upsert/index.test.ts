import { vi } from "vitest";
import type { LocalRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { upsertRecords } from "../../upsert";

import { pattern as upsertByRecordNumber } from "./fixtures/upsertByRecordNumber";
import { pattern as upsertByRecordNumberWithAppCode } from "./fixtures/upsertByRecordNumberWithAppCode";
import { pattern as upsertByRecordNumberWithAppCodeOnKintone } from "./fixtures/upsertByRecordNumberWithAppCodeOnKintone";
import { pattern as upsertBySingleLineText } from "./fixtures/upsertByNumber";
import { pattern as upsertByNumber } from "./fixtures/upsertBySingleLineText";
import { pattern as upsertByNonUniqueKey } from "./fixtures/upsertByNonUniqueKey";
import { pattern as upsertByUnsupportedField } from "./fixtures/upsertByUnsupportedField";
import { pattern as upsertByNonExistentField } from "./fixtures/upsertByNonExistentField";
import { pattern as upsertWithMissingKeyFromRecord } from "./fixtures/upsertWithMissingKeyFromRecord";
import { pattern as upsertWithMissingFieldFromRecord } from "./fixtures/upsertWithMissingFieldFromRecord";
import { pattern as upsertWithMissingFieldInTableFromRecord } from "./fixtures/upsertWithMissingFieldInTableFromRecord";
import { pattern as upsertByRecordNumberWithMixedRecordNumber } from "./fixtures/upsertByRecordNumberWithInvalidRecordNumber";
import { pattern as upsertByRecordNumberWithInvalidRecordNumber } from "./fixtures/upsertByRecordNumberWithMixedRecordNumber";

import { UpsertRecordsError } from "../../upsert/error";
import { LocalRecordRepositoryMock } from "../../../repositories/localRecordRepositoryMock";

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

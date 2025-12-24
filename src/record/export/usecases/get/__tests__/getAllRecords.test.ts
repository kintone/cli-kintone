import { vi } from "vitest";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { getAllRecords } from "../getAllRecords";
import type { LocalRecord } from "../../../types/record";
import type { KintoneRecordForResponse } from "../../../../../kintone/types";

describe("getAllRecords", () => {
  let apiClient: KintoneRestAPIClient;
  beforeEach(() => {
    apiClient = new KintoneRestAPIClient({
      baseUrl: "https://localhost/",
      auth: { apiToken: "dummy" },
    });
  });

  it("should pass parameters to the apiClient correctly (without orderBy)", async () => {
    type Response = Awaited<
      ReturnType<KintoneRestAPIClient["record"]["getRecords"]>
    >;
    const mockDefaultResponse: Response = {
      records: [],
      totalCount: null,
    };

    const chunkSize = 500;
    const chunks = Array.from(
      { length: 1200 },
      (v, k): KintoneRecordForResponse => ({
        $id: { type: "__ID__", value: `${k + 1}` },
      }),
    ).reduce(
      (acc, _, i, arr) =>
        i % chunkSize === 0 ? [...acc, arr.slice(i, i + chunkSize)] : acc,
      [] as KintoneRecordForResponse[][],
    );
    const mockResponse: Response[] = chunks.map((chunk) => ({
      records: chunk,
      totalCount: null,
    }));
    apiClient.record.getRecords = mockResponse.reduce(
      (acc, value) => acc.mockResolvedValueOnce(value),
      vi.fn().mockResolvedValue(mockDefaultResponse),
    );

    const expected: LocalRecord[] = mockResponse
      .map((resp) => resp.records)
      .flat();
    const actual = [];
    for await (const chunk of getAllRecords({
      apiClient,
      app: "1",
      condition: "condition",
    })) {
      actual.push(...chunk);
    }
    expect(actual).toStrictEqual(expected);
  });

  it("should pass parameters to the apiClient correctly (with orderBy)", async () => {
    type Response = Awaited<
      ReturnType<KintoneRestAPIClient["record"]["getRecordsByCursor"]>
    >;

    const mockDefaultResponse: Response = {
      records: [],
      next: false,
    };

    const chunkSize = 500;
    const chunks = Array.from(
      { length: 1200 },
      (v, k): KintoneRecordForResponse => ({
        $id: { type: "__ID__", value: `${k + 1}` },
      }),
    ).reduce(
      (acc, _, i, arr) =>
        i % chunkSize === 0 ? [...acc, arr.slice(i, i + chunkSize)] : acc,
      [] as KintoneRecordForResponse[][],
    );
    const mockResponse: Response[] = chunks.map((chunk) => ({
      records: chunk,
      next: true,
    }));

    apiClient.record.createCursor = vi
      .fn()
      .mockResolvedValue({ id: "1", totalCount: "" });
    apiClient.record.getRecordsByCursor = mockResponse.reduce(
      (acc, value) => acc.mockResolvedValueOnce(value),
      vi.fn().mockResolvedValue(mockDefaultResponse),
    );
    apiClient.record.deleteCursor = vi.fn().mockResolvedValue({});

    const expected: LocalRecord[] = mockResponse
      .map((resp) => resp.records)
      .flat();
    const actual = [];
    for await (const chunk of getAllRecords({
      apiClient,
      app: "1",
      condition: "condition",
      orderBy: "recordNumber asc",
    })) {
      actual.push(...chunk);
    }
    expect(actual).toStrictEqual(expected);
  });
});

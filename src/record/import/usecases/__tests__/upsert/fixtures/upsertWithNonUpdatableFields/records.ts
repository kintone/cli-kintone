import type { LocalRecord } from "../../../../../types/record";

export const records: LocalRecord[] = [
  {
    data: {
      recordNumber: {
        value: "1",
      },
      singleLineText: {
        value: "value1",
      },
      number: {
        value: "1",
      },
      creator: {
        value: {
          code: "creator1",
        },
      },
      modifier: {
        value: {
          code: "modifier1",
        },
      },
      createdTime: { value: "2021-02-16T02:43:00Z" },
      updatedTime: { value: "2022-03-27T03:54:00Z" },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 1, lastRowIndex: 1 },
    },
  },
  {
    data: {
      recordNumber: {
        value: "3",
      },
      singleLineText: {
        value: "value3",
      },
      number: {
        value: "3",
      },
      creator: {
        value: {
          code: "creator3",
        },
      },
      modifier: {
        value: {
          code: "modifier3",
        },
      },
      createdTime: { value: "2021-02-16T02:43:00Z" },
      updatedTime: { value: "2022-03-27T03:54:00Z" },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 2, lastRowIndex: 2 },
    },
  },
];

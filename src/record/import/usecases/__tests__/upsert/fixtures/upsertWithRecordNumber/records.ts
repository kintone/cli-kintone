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
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 2, lastRowIndex: 2 },
    },
  },
];

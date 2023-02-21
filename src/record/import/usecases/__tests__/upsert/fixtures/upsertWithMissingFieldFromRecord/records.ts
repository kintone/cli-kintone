import type { LocalRecord } from "../../../../../types/record";

export const records: LocalRecord[] = [
  {
    data: {
      singleLineText: {
        value: "value1",
      },
      number: {
        value: "1",
      },
      date: {
        value: "2022-03-01",
      },
      singleLineText_nonUnique: {
        value: "value1",
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 1, lastRowIndex: 1 },
    },
  },
  {
    data: {
      singleLineText: {
        value: "value3",
      },
      number: {
        value: "3",
      },
      date: {
        value: "2022-04-01",
      },
      singleLineText_nonUnique: {
        value: "value1",
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 2, lastRowIndex: 2 },
    },
  },
];

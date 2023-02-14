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
      table: {
        value: [
          {
            id: "123",
            value: {
              singleLineTextInTable: { value: "value1" },
            },
          },
        ],
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
      table: {
        value: [
          {
            id: "123",
            value: {
              singleLineTextInTable: { value: "value1" },
            },
          },
        ],
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 2, lastRowIndex: 2 },
    },
  },
];

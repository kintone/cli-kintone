import type { LocalRecord } from "../../../../../../types/record";

export const expected: LocalRecord[] = [
  {
    data: {
      singleLineText: {
        value: '"single line text"',
      },
      multiLineText: {
        value: "multi\nline\ntext",
      },
      multiSelect: {
        value: ['"sample3"', "sample4,sample5"],
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 1, lastRowIndex: 1 },
    },
  },
  {
    data: {
      singleLineText: {
        value: '"single line text"',
      },
      multiLineText: {
        value: "multi\nline\ntext",
      },
      multiSelect: {
        value: ['"sample4"', "sample5,sample6"],
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 2, lastRowIndex: 2 },
    },
  },
];

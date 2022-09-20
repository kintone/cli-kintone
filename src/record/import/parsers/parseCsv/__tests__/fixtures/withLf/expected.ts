import type { KintoneRecord } from "../../../../../types/record";

export const expected: KintoneRecord[] = [
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
    metadata: { csv: { lineFirst: 0, lineLast: 0 } },
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
    metadata: { csv: { lineFirst: 1, lineLast: 1 } },
  },
];

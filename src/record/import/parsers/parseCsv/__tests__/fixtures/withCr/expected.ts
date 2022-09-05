import type { KintoneRecord } from "../../../../../types/record";

export const expected: KintoneRecord[] = [
  {
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
  {
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
];

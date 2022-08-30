import type { KintoneRecord } from "../../../../../types/record";

export const records: KintoneRecord[] = [
  {
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
  {
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
];

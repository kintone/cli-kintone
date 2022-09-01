import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

export const recordsOnKintone: Awaited<
  ReturnType<KintoneRestAPIClient["record"]["getAllRecords"]>
> = [
  {
    recordNumber: {
      type: "RECORD_NUMBER",
      value: "1",
    },
    singleLineText: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    number: {
      type: "NUMBER",
      value: "1",
    },
  },
  {
    recordNumber: {
      type: "RECORD_NUMBER",
      value: "2",
    },
    singleLineText: {
      type: "SINGLE_LINE_TEXT",
      value: "value2",
    },
    number: {
      type: "NUMBER",
      value: "2",
    },
  },
];

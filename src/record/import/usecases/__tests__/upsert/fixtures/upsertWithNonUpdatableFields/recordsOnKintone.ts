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
    creator: {
      type: "CREATOR",
      value: {
        code: "creator1",
        name: "Creator No.1",
      },
    },
    modifier: {
      type: "MODIFIER",
      value: {
        code: "modifier1",
        name: "Modifier No.1",
      },
    },
    createdTime: { type: "CREATED_TIME", value: "2021-02-16T02:43:00Z" },
    updatedTime: { type: "UPDATED_TIME", value: "2022-03-27T03:54:00Z" },
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
    creator: {
      type: "CREATOR",
      value: {
        code: "creator2",
        name: "Creator No.2",
      },
    },
    modifier: {
      type: "MODIFIER",
      value: {
        code: "modifier2",
        name: "Modifier No.2",
      },
    },
    createdTime: { type: "CREATED_TIME", value: "2021-02-16T02:43:00Z" },
    updatedTime: { type: "UPDATED_TIME", value: "2022-03-27T03:54:00Z" },
  },
];

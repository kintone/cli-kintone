import type { KintoneRestAPIClient } from "@kintone/rest-api-client";

export const recordsOnKintone: Awaited<
  ReturnType<KintoneRestAPIClient["record"]["getAllRecords"]>
> = [
  {
    singleLineText: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
    number: {
      type: "NUMBER",
      value: "1",
    },
    table: {
      type: "SUBTABLE",
      value: [
        {
          id: "123",
          value: {
            singleLineTextInTable: {
              type: "SINGLE_LINE_TEXT",
              value: "value1",
            },
            numberInTable: {
              type: "NUMBER",
              value: "1",
            },
          },
        },
      ],
    },
  },
  {
    singleLineText: {
      type: "SINGLE_LINE_TEXT",
      value: "value2",
    },
    number: {
      type: "NUMBER",
      value: "2",
    },
    table: {
      type: "SUBTABLE",
      value: [],
    },
  },
];

import { KintoneRecordForResponse } from "../../../../../../kintone/types";
import { KintoneRecord } from "../../../../types/record";

export const input: KintoneRecordForResponse[] = [
  {
    $id: {
      type: "__ID__",
      value: "1",
    },
    fieldCode: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
  },
  {
    $id: {
      type: "__ID__",
      value: "2",
    },
    fieldCode: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
  },
];

export const expected: KintoneRecord[] = input;

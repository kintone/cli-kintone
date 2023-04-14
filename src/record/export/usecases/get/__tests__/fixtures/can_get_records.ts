import type { KintoneRecordForResponse } from "../../../../../../kintone/types";
import type { LocalRecord } from "../../../../types/record";
import type { RecordSchema } from "../../../../types/schema";

export const input: KintoneRecordForResponse[] = [
  {
    $id: {
      type: "__ID__",
      value: "1",
    },
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
  },
  {
    $id: {
      type: "__ID__",
      value: "2",
    },
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
  },
];

export const expected: LocalRecord[] = [
  {
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
  },
  {
    value1: {
      type: "SINGLE_LINE_TEXT",
      value: "value1",
    },
  },
];

export const schema: RecordSchema = {
  fields: [
    {
      type: "SINGLE_LINE_TEXT",
      code: "value1",
      label: "value1",
      noLabel: false,
      required: true,
      defaultValue: "",
      unique: false,
      minLength: "123",
      maxLength: "0",
      expression: "",
      hideExpression: false,
    },
  ],
  hasSubtable: false,
};

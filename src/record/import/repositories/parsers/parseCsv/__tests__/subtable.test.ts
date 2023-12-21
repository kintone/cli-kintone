import type { SubtableRow, FieldInSubtable } from "../subtable";

import { fieldInSubtableReader } from "../subtable";
import type { InSubtable } from "../../../../types/schema";

const fields: InSubtable[] = [
  {
    type: "SINGLE_LINE_TEXT",
    code: "Text_0",
    label: "Text",
    noLabel: false,
    required: false,
    minLength: "",
    maxLength: "",
    expression: "",
    hideExpression: false,
    unique: false,
    defaultValue: "",
  },
  {
    type: "NUMBER",
    code: "Number_0",
    label: "Number",
    noLabel: false,
    required: false,
    minValue: "",
    maxValue: "",
    digit: false,
    unique: false,
    defaultValue: "",
    displayScale: "",
    unit: "",
    unitPosition: "BEFORE",
  },
];

const patterns: Array<{
  description: string;
  input: SubtableRow;
  expected: FieldInSubtable[];
}> = [
  {
    description: "all fields have valid value",
    input: {
      id: "",
      row: {
        "*": "*",
        Record_number: "",
        Table: "1",
        Text_0: "Text_0",
        Number_0: "10",
      },
      fields,
    },
    expected: [
      { code: "Text_0", value: "Text_0", type: "SINGLE_LINE_TEXT" },
      { code: "Number_0", value: "10", type: "NUMBER" },
    ],
  },
  {
    description: "empty field value",
    input: {
      id: "",
      row: {
        "*": "*",
        Record_number: "",
        Table: "1",
        Text_0: "",
        Number_0: "10",
      },
      fields,
    },
    expected: [
      { code: "Text_0", value: "", type: "SINGLE_LINE_TEXT" },
      { code: "Number_0", value: "10", type: "NUMBER" },
    ],
  },
  {
    description: "missing field value",
    input: {
      id: "",
      row: {
        "*": "*",
        Record_number: "",
        Table: "1",
        Number_0: "10",
      },
      fields,
    },
    expected: [{ code: "Number_0", value: "10", type: "NUMBER" }],
  },
];

describe("fieldInSubtableReader", () => {
  it.each(patterns)("$description", ({ input, expected }) => {
    expect(Array.from(fieldInSubtableReader(input))).toStrictEqual(expected);
  });
});

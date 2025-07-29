import type { RecordSchema } from "../../../../../types/schema";

export const schema: RecordSchema = {
  fields: [
    {
      type: "RECORD_NUMBER",
      code: "recordNumber",
      label: "recordNumber",
      noLabel: false,
    },
    {
      type: "SINGLE_LINE_TEXT",
      code: "singleLineText",
      label: "singleLineText",
      noLabel: false,
      required: false,
      minLength: "",
      maxLength: "",
      expression: "",
      hideExpression: false,
      unique: true,
      defaultValue: "",
    },
    {
      type: "NUMBER",
      code: "number",
      label: "number",
      noLabel: false,
      required: true,
      minValue: "",
      maxValue: "",
      digit: false,
      unique: true,
      defaultValue: "",
      displayScale: "",
      unit: "",
      unitPosition: "BEFORE",
    },
  ],
};

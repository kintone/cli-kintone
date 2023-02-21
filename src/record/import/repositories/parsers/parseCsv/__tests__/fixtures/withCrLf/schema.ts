import type { RecordSchema } from "../../../../../../types/schema";

export const schema: RecordSchema = {
  fields: [
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
      unique: false,
      defaultValue: "",
    },
    {
      type: "MULTI_LINE_TEXT",
      code: "multiLineText",
      label: "multiLineText",
      noLabel: false,
      required: false,
      defaultValue: "",
    },
    {
      type: "MULTI_SELECT",
      code: "multiSelect",
      label: "multiSelect",
      noLabel: false,
      required: false,
      options: {
        sample1: {
          label: "sample1",
          index: "0",
        },
        "tab\ttab": {
          label: "tab\ttab",
          index: "4",
        },
        '"sample2"': {
          label: '"sample2"',
          index: "1",
        },
        "sample4,sample5": {
          label: "sample4,sample5",
          index: "3",
        },
        '"sample3"': {
          label: '"sample3"',
          index: "2",
        },
      },
      defaultValue: [],
    },
  ],
};

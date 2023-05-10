import type { RecordSchema } from "../../../../../types/schema";

export const schema: RecordSchema = {
  hasSubtable: false,
  fields: [
    {
      type: "RECORD_NUMBER",
      code: "レコード番号",
      label: "レコード番号",
      noLabel: false,
    },
    {
      type: "SINGLE_LINE_TEXT",
      code: "文字列__1行_",
      label: "文字列__1行_",
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
      type: "CREATED_TIME",
      code: "作成日時",
      label: "作成日時",
      noLabel: false,
    },
  ],
};

import type { RecordSchema } from "../../../types/schema";

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
      type: "MODIFIER",
      code: "更新者",
      label: "更新者",
      noLabel: false,
    },
    {
      type: "CREATOR",
      code: "作成者",
      label: "作成者",
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
      type: "RADIO_BUTTON",
      code: "ラジオボタン",
      label: "ラジオボタン",
      noLabel: false,
      required: true,
      options: {
        sample1: {
          label: "選択肢1",
          index: "0",
        },
        sample2: {
          label: "選択肢2",
          index: "1",
        },
      },
      defaultValue: "選択肢1",
      align: "HORIZONTAL",
    },
    {
      type: "UPDATED_TIME",
      code: "更新日時",
      label: "更新日時",
      noLabel: false,
    },
    {
      type: "CREATED_TIME",
      code: "作成日時",
      label: "作成日時",
      noLabel: false,
    },
  ],
};

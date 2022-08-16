import { LayoutJson } from "../../../../../../../../kintone/types";

export const layoutJson: LayoutJson = {
  revision: "29",
  layout: [
    {
      type: "ROW",
      fields: [
        { type: "RECORD_NUMBER", code: "recordNumber", size: { width: "123" } },
        { type: "UPDATED_TIME", code: "updatedTime", size: { width: "123" } },
        {
          type: "DROP_DOWN",
          code: "dropDown",
          size: { width: "123" },
        },
        { type: "CREATOR", code: "creator", size: { width: "123" } },
        { type: "MODIFIER", code: "modifier", size: { width: "123" } },
        {
          type: "RICH_TEXT",
          code: "richText",
          size: { width: "123", innerHeight: "123" },
        },
      ],
    },
    {
      type: "ROW",
      fields: [
        {
          type: "SINGLE_LINE_TEXT",
          code: "singleLineText",
          size: { width: "123" },
        },
        { type: "NUMBER", code: "number", size: { width: "123" } },
        { type: "RADIO_BUTTON", code: "radioButton", size: { width: "123" } },
        {
          type: "MULTI_LINE_TEXT",
          code: "multiLineText",
          size: { width: "123", innerHeight: "123" },
        },
        { type: "CREATED_TIME", code: "createdTime", size: { width: "123" } },
        { type: "CHECK_BOX", code: "checkBox", size: { width: "123" } },
      ],
    },
    {
      type: "ROW",
      fields: [
        {
          type: "CALC",
          code: "calc",
          size: { width: "123" },
        },
        {
          type: "MULTI_LINE_TEXT",
          code: "multiSelect",
          size: { width: "123", innerHeight: "123" },
        },
        { type: "FILE", code: "file", size: { width: "123" } },
      ],
    },
  ],
};

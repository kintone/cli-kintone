import type { LayoutJson } from "../../../../../../kintone/types";

export const layoutJson: LayoutJson = {
  revision: "29",
  layout: [
    {
      type: "ROW",
      fields: [
        {
          type: "DROP_DOWN",
          code: "dropDown",
          size: { width: "123" },
        },
        { type: "MODIFIER", code: "modifier", size: { width: "123" } },
        {
          type: "RICH_TEXT",
          code: "richText",
          size: { width: "123", innerHeight: "123" },
        },
        { type: "CREATOR", code: "creator", size: { width: "123" } },
      ],
    },
    {
      type: "SUBTABLE",
      code: "subTable",
      fields: [
        {
          type: "SINGLE_LINE_TEXT",
          code: "subTableText",
          size: { width: "123" },
        },
        { type: "CHECK_BOX", code: "subTableCheckbox", size: { width: "123" } },
        { type: "FILE", code: "subTableFile", size: { width: "123" } },
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
        { type: "RECORD_NUMBER", code: "recordNumber", size: { width: "123" } },
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
        { type: "UPDATED_TIME", code: "updatedTime", size: { width: "123" } },
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
      ],
    },
    {
      type: "GROUP",
      code: "group",
      layout: [
        {
          type: "ROW",
          fields: [
            { type: "USER_SELECT", code: "userSelect", size: { width: "123" } },
            {
              type: "ORGANIZATION_SELECT",
              code: "organizationSelect",
              size: { width: "123" },
            },
            {
              type: "GROUP_SELECT",
              code: "groupSelect",
              size: { width: "123" },
            },
          ],
        },
        {
          type: "ROW",
          fields: [
            { type: "DATE", code: "date", size: { width: "123" } },
            {
              type: "DATETIME",
              code: "dateTime",
              size: { width: "123" },
            },
            { type: "TIME", code: "time", size: { width: "123" } },
          ],
        },
      ],
    },
  ],
};

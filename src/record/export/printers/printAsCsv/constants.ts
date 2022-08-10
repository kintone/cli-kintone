import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

export const LINE_BREAK = "\n";
export const SEPARATOR = ",";
export const PRIMARY_MARK = "*";

export const supportedFieldTypes: Array<
  KintoneFormFieldProperty.OneOf["type"]
> = [
  "RECORD_NUMBER",
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "CALC",
  "CREATOR",
  "MODIFIER",
  "UPDATED_TIME",
  "CREATED_TIME",
  "DATETIME",
  "DATE",
  "TIME",
  "MULTI_SELECT",
  "CHECK_BOX",
  "FILE",
  "SUBTABLE",
  "USER_SELECT",
  "ORGANIZATION_SELECT",
  "GROUP_SELECT",
];

export const supportedFieldTypesInSubtable: Array<
  KintoneFormFieldProperty.InSubtable["type"]
> = [
  "SINGLE_LINE_TEXT",
  "RADIO_BUTTON",
  "MULTI_LINE_TEXT",
  "NUMBER",
  "RICH_TEXT",
  "LINK",
  "DROP_DOWN",
  "CALC",
  "DATETIME",
  "DATE",
  "TIME",
  "MULTI_SELECT",
  "CHECK_BOX",
  "FILE",
  "USER_SELECT",
  "ORGANIZATION_SELECT",
  "GROUP_SELECT",
];

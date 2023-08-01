import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";

type SupportedFieldType = Exclude<
  KintoneFormFieldProperty.OneOf,
  | KintoneFormFieldProperty.Status
  | KintoneFormFieldProperty.StatusAssignee
  | KintoneFormFieldProperty.Category
  | KintoneFormFieldProperty.Group
  | KintoneFormFieldProperty.ReferenceTable
  | KintoneFormFieldProperty.Lookup
>;

const supportedFieldTypes: Array<SupportedFieldType["type"]> = [
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

export const isSupportedField = (
  field: KintoneFormFieldProperty.OneOf,
): field is SupportedFieldType =>
  supportedFieldTypes.some(
    (supportedFieldType) => field.type === supportedFieldType,
  );

type SupportedFieldTypeInSubtable = Exclude<
  KintoneFormFieldProperty.InSubtable,
  KintoneFormFieldProperty.Lookup
>;

const supportedFieldTypesInSubtable: Array<
  SupportedFieldTypeInSubtable["type"]
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

export const isSupportedFieldInSubtable = (
  field: KintoneFormFieldProperty.InSubtable,
): field is SupportedFieldTypeInSubtable =>
  supportedFieldTypesInSubtable.some(
    (supportedFieldType) => field.type === supportedFieldType,
  );

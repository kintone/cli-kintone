import type { KintoneRecordField } from "@kintone/rest-api-client";

type FieldWith<T extends string, V> = {
  type: T;
  value: V;
};

export type File = FieldWith<
  "FILE",
  Array<{
    contentType: string;
    fileKey: string;
    name: string;
    size: string;
    localFilePath?: string;
  }>
>;

export type InSubtable =
  | KintoneRecordField.SingleLineText
  | KintoneRecordField.Number
  | KintoneRecordField.Calc
  | KintoneRecordField.MultiLineText
  | KintoneRecordField.RichText
  | KintoneRecordField.Link
  | KintoneRecordField.CheckBox
  | KintoneRecordField.RadioButton
  | KintoneRecordField.Dropdown
  | KintoneRecordField.MultiSelect
  | File
  | KintoneRecordField.Date
  | KintoneRecordField.Time
  | KintoneRecordField.DateTime
  | KintoneRecordField.UserSelect
  | KintoneRecordField.OrganizationSelect
  | KintoneRecordField.GroupSelect;

export type Subtable = KintoneRecordField.Subtable<{
  [fieldCode: string]: InSubtable;
}>;

export type OneOf =
  | KintoneRecordField.ID
  | KintoneRecordField.Revision
  | KintoneRecordField.RecordNumber
  | KintoneRecordField.Creator
  | KintoneRecordField.CreatedTime
  | KintoneRecordField.Modifier
  | KintoneRecordField.UpdatedTime
  | KintoneRecordField.SingleLineText
  | KintoneRecordField.Number
  | KintoneRecordField.Calc
  | KintoneRecordField.MultiLineText
  | KintoneRecordField.RichText
  | KintoneRecordField.Link
  | KintoneRecordField.CheckBox
  | KintoneRecordField.RadioButton
  | KintoneRecordField.Dropdown
  | KintoneRecordField.MultiSelect
  | File
  | KintoneRecordField.Date
  | KintoneRecordField.Time
  | KintoneRecordField.DateTime
  | KintoneRecordField.UserSelect
  | KintoneRecordField.OrganizationSelect
  | KintoneRecordField.GroupSelect
  | KintoneRecordField.Category
  | KintoneRecordField.Status
  | KintoneRecordField.StatusAssignee
  | Subtable;

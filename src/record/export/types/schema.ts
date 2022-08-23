import { KintoneFormFieldProperty } from "@kintone/rest-api-client";

export type RecordSchema = {
  fields: FieldSchema[];
  hasSubtable: boolean;
};

export type FieldSchema = OneOf;

type OneOf =
  | KintoneFormFieldProperty.RecordNumber
  | KintoneFormFieldProperty.Creator
  | KintoneFormFieldProperty.CreatedTime
  | KintoneFormFieldProperty.Modifier
  | KintoneFormFieldProperty.UpdatedTime
  | KintoneFormFieldProperty.Category
  | KintoneFormFieldProperty.Status
  | KintoneFormFieldProperty.StatusAssignee
  | KintoneFormFieldProperty.SingleLineText
  | KintoneFormFieldProperty.Number
  | KintoneFormFieldProperty.Calc
  | KintoneFormFieldProperty.MultiLineText
  | KintoneFormFieldProperty.RichText
  | KintoneFormFieldProperty.Link
  | KintoneFormFieldProperty.CheckBox
  | KintoneFormFieldProperty.RadioButton
  | KintoneFormFieldProperty.Dropdown
  | KintoneFormFieldProperty.MultiSelect
  | KintoneFormFieldProperty.File
  | KintoneFormFieldProperty.Date
  | KintoneFormFieldProperty.Time
  | KintoneFormFieldProperty.DateTime
  | KintoneFormFieldProperty.UserSelect
  | KintoneFormFieldProperty.OrganizationSelect
  | KintoneFormFieldProperty.GroupSelect
  | KintoneFormFieldProperty.Group
  | KintoneFormFieldProperty.ReferenceTable
  | KintoneFormFieldProperty.Lookup
  | Subtable;

type Subtable = {
  type: "SUBTABLE";
  code: string;
  label: string;
  noLabel: boolean;
  fields: KintoneFormFieldProperty.InSubtable[];
};

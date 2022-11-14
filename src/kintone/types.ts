import type {
  KintoneFormFieldProperty,
  KintoneFormLayout,
  KintoneRecordField,
} from "@kintone/rest-api-client";

export type RecordID = string | number;
export type Revision = string | number;

export type UpdateKey = {
  field: string;
  value: string | number;
};

export type CsvRow = Record<string, string>;
export type KintoneRecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};
export type KintoneRecordForUpdateParameter =
  | { id: RecordID; record?: KintoneRecordForParameter; revision?: Revision }
  | {
      updateKey: UpdateKey;
      record?: KintoneRecordForParameter;
      revision?: Revision;
    };

export type KintoneRecordForResponse = {
  [fieldCode: string]: KintoneRecordField.OneOf;
};
export type FieldProperties = Record<string, KintoneFormFieldProperty.OneOf>;
export type FieldsJson = {
  properties: FieldProperties;
  revision: Revision;
};

export type LayoutJson = {
  layout: Array<
    | KintoneFormLayout.Row<KintoneFormLayout.Field.OneOf[]>
    | KintoneFormLayout.Subtable<KintoneFormLayout.Field.InSubtable[]>
    | KintoneFormLayout.Group<
        Array<KintoneFormLayout.Row<KintoneFormLayout.Field.OneOf[]>>
      >
  >;
  revision: string;
};

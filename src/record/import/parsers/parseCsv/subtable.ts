import { CsvRow, FieldsJson } from "../../../../kintone/types";
import * as Fields from "../../types/field";
import { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import { importSupportedFieldTypesInSubtable } from "./constants";
import { convertFieldValue } from "./fieldValue";

type SubtableField = {
  code: string;
  rows: CsvRow[];
  fields: {
    [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
  };
};

export const convertSubtableField = (
  subtableField: SubtableField
): Fields.Subtable => {
  const field: Fields.Subtable = { value: [] };
  for (const subtableRow of subtableRowReader(subtableField)) {
    field.value.push(convertSubtableRow(subtableRow));
  }
  return field;
};

// eslint-disable-next-line func-style
export function* subtableFieldReader(
  rows: CsvRow[],
  fieldsJson: FieldsJson
): Generator<SubtableField, void, undefined> {
  const subtableFieldProperties = Object.entries(fieldsJson.properties).flatMap(
    ([fieldCode, fieldProperty]) =>
      fieldProperty.type === "SUBTABLE" ? [{ fieldCode, fieldProperty }] : []
  );

  for (const { fieldCode, fieldProperty } of subtableFieldProperties) {
    // pick rows which contains subtable related fields
    const subtableRows = rows.filter((row) =>
      doesRowContainSubtableFields(row, fieldCode, fieldProperty.fields)
    );

    if (subtableRows.length > 0) {
      yield {
        code: fieldCode,
        rows: subtableRows,
        fields: fieldProperty.fields,
      };
    }
  }
}
const doesRowContainSubtableFields = (
  row: CsvRow,
  subtableFieldCode: string,
  subtableFields: {
    [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
  }
): boolean =>
  Object.keys(subtableFields)
    .concat(subtableFieldCode)
    .some((fieldCode) => !!row[fieldCode]);

type SubtableRow = {
  id: string;
  row: CsvRow;
  fields: {
    [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
  };
};
const convertSubtableRow = (
  subtableRow: SubtableRow
): Fields.Subtable["value"][number] => {
  const newRow: Fields.Subtable["value"][number] = {
    id: subtableRow.id,
    value: {},
  };
  for (const fieldsInSubtable of fieldInSubtableReader(subtableRow)) {
    newRow.value[fieldsInSubtable.code] =
      convertFieldInSubtable(fieldsInSubtable);
  }
  return newRow;
};

// eslint-disable-next-line func-style
function* subtableRowReader(
  subtableField: SubtableField
): Generator<SubtableRow, void, undefined> {
  for (const row of subtableField.rows) {
    yield { id: row[subtableField.code], row, fields: subtableField.fields };
  }
}

type FieldInSubtable = {
  code: string;
  value: string;
  type: KintoneFormFieldProperty.InSubtable["type"];
};
const convertFieldInSubtable = (
  fieldInSubtable: FieldInSubtable
): Fields.InSubtable => {
  return convertFieldValue(fieldInSubtable) as Fields.InSubtable;
};

// eslint-disable-next-line func-style
function* fieldInSubtableReader({
  row,
  fields,
}: SubtableRow): Generator<FieldInSubtable, void, undefined> {
  for (const [fieldCodeInSubtable, fieldPropertyInSubtable] of Object.entries(
    fields
  )) {
    if (
      !importSupportedFieldTypesInSubtable.includes(
        fieldPropertyInSubtable.type
      )
    ) {
      continue;
    }
    if (!row[fieldCodeInSubtable]) {
      continue;
    }

    yield {
      code: fieldCodeInSubtable,
      value: row[fieldCodeInSubtable],
      type: fieldPropertyInSubtable.type,
    };
  }
}

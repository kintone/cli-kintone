import type * as Fields from "../../types/field";
import type { KintoneRecord } from "../../types/record";
import type { CsvRow, FieldsJson } from "../../../../kintone/types";
import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";

import { convertFieldValue } from "./fieldValue";
import { supportedFieldTypesInSubtable } from "./constants";

type SubtableField = {
  code: string;
  value: Fields.Subtable;
  fields: {
    [fieldCode: string]: KintoneFormFieldProperty.InSubtable;
  };
};

export const hasSubtable = (fieldsJson: FieldsJson) =>
  Object.values(fieldsJson.properties).some(
    (field) => field.type === "SUBTABLE"
  );

export const convertSubtableField = (
  field: SubtableField,
  useLocalFilePath: boolean
): CsvRow[] => {
  const subtableRows: CsvRow[] = [];
  for (const row of subtableRowReader(field)) {
    subtableRows.push(
      convertSubtableRow(row, field.code, field.fields, useLocalFilePath)
    );
  }
  return subtableRows;
};

// eslint-disable-next-line func-style
export function* subtableFieldReader(
  record: KintoneRecord,
  fieldsJson: FieldsJson
): Generator<SubtableField, void, undefined> {
  for (const [code, properties] of Object.entries(fieldsJson.properties)) {
    if (properties.type !== "SUBTABLE") {
      continue;
    }

    if (!(code in record)) {
      throw new Error(`The record is missing a field (${code})`);
    }
    yield {
      code,
      value: record[code] as Fields.Subtable,
      fields: properties.fields,
    };
  }
}

type SubtableRow = Fields.Subtable["value"][number];

const convertSubtableRow = (
  subtableRow: SubtableRow,
  subtableFieldCode: string,
  subtableFields: SubtableField["fields"],
  useLocalFilePath: boolean
): CsvRow => {
  const newRow: CsvRow = {
    [subtableFieldCode]: subtableRow.id,
  };
  for (const fieldsInSubtable of fieldsInSubtableReader(
    subtableRow,
    subtableFieldCode,
    subtableFields
  )) {
    newRow[fieldsInSubtable.code] = convertFieldInSubtable(
      fieldsInSubtable,
      useLocalFilePath
    );
  }
  return newRow;
};

// eslint-disable-next-line func-style
function* subtableRowReader(
  subtableField: SubtableField
): Generator<SubtableRow, void, undefined> {
  yield* subtableField.value.value;
}

type FieldInSubtable = {
  code: string;
  value: Fields.InSubtable;
};

const convertFieldInSubtable = (
  fieldInSubtable: FieldInSubtable,
  useLocalFilePath: boolean
): string => {
  return convertFieldValue(fieldInSubtable.value, useLocalFilePath);
};

// eslint-disable-next-line func-style
function* fieldsInSubtableReader(
  subtableRow: SubtableRow,
  subtableFieldCode: string,
  subtableFields: SubtableField["fields"]
): Generator<FieldInSubtable, void, undefined> {
  for (const [fieldCodeInSubtable, fieldPropertyInSubtable] of Object.entries(
    subtableFields
  )) {
    if (!supportedFieldTypesInSubtable.includes(fieldPropertyInSubtable.type)) {
      continue;
    }

    if (!subtableRow.value[fieldCodeInSubtable]) {
      continue;
    }

    yield {
      code: fieldCodeInSubtable,
      value: subtableRow.value[fieldCodeInSubtable],
    };
  }
}

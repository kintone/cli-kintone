import type * as Fields from "../../../types/field";
import type { LocalRecord } from "../../../types/record";
import type { CsvRow, FieldsJson } from "../../../../../kintone/types";
import type { KintoneFormFieldProperty } from "@kintone/rest-api-client";
import type { RecordSchema } from "../../../types/schema";

import { convertFieldValue } from "./fieldValue";

type SubtableField = {
  code: string;
  value: Fields.Subtable;
  fields: KintoneFormFieldProperty.InSubtable[];
};

export const hasSubtable = (fieldsJson: FieldsJson) =>
  Object.values(fieldsJson.properties).some(
    (field) => field.type === "SUBTABLE",
  );

export const convertSubtableField = (
  field: SubtableField,
  useLocalFilePath: boolean,
): CsvRow[] => {
  const subtableRows: CsvRow[] = [];
  for (const row of subtableRowReader(field)) {
    subtableRows.push(
      convertSubtableRow(row, field.code, field.fields, useLocalFilePath),
    );
  }
  return subtableRows;
};

// eslint-disable-next-line func-style
export function* subtableFieldReader(
  record: LocalRecord,
  schema: RecordSchema,
): Generator<SubtableField, void, undefined> {
  for (const field of schema.fields) {
    if (field.type !== "SUBTABLE") {
      continue;
    }

    if (!(field.code in record)) {
      throw new Error(`The record is missing a field (${field.code})`);
    }
    yield {
      code: field.code,
      value: record[field.code] as Fields.Subtable,
      fields: field.fields,
    };
  }
}

type SubtableRow = Fields.Subtable["value"][number];

const convertSubtableRow = (
  subtableRow: SubtableRow,
  subtableFieldCode: string,
  subtableFields: SubtableField["fields"],
  useLocalFilePath: boolean,
): CsvRow => {
  const newRow: CsvRow = {
    [subtableFieldCode]: subtableRow.id,
  };
  for (const fieldsInSubtable of fieldsInSubtableReader(
    subtableRow,
    subtableFieldCode,
    subtableFields,
  )) {
    newRow[fieldsInSubtable.code] = convertFieldInSubtable(
      fieldsInSubtable,
      useLocalFilePath,
    );
  }
  return newRow;
};

// eslint-disable-next-line func-style
function* subtableRowReader(
  subtableField: SubtableField,
): Generator<SubtableRow, void, undefined> {
  yield* subtableField.value.value;
}

type FieldInSubtable = {
  code: string;
  value: Fields.InSubtable;
};

const convertFieldInSubtable = (
  fieldInSubtable: FieldInSubtable,
  useLocalFilePath: boolean,
): string => {
  return convertFieldValue(fieldInSubtable.value, useLocalFilePath);
};

// eslint-disable-next-line func-style
function* fieldsInSubtableReader(
  subtableRow: SubtableRow,
  subtableFieldCode: string,
  subtableFields: SubtableField["fields"],
): Generator<FieldInSubtable, void, undefined> {
  for (const fieldPropertyInSubtable of subtableFields) {
    if (!(fieldPropertyInSubtable.code in subtableRow.value)) {
      continue;
    }

    yield {
      code: fieldPropertyInSubtable.code,
      value: subtableRow.value[fieldPropertyInSubtable.code],
    };
  }
}

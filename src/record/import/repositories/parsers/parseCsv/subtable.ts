import type { CsvRow } from "../../../../../kintone/types";
import type * as Fields from "../../../types/field";
import type { InSubtable, RecordSchema } from "../../../types/schema";

import { convertFieldValue } from "./fieldValue";

type SubtableField = {
  code: string;
  rows: CsvRow[];
  fields: InSubtable[];
};

export const convertSubtableField = (
  subtableField: SubtableField,
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
  schema: RecordSchema,
): Generator<SubtableField, void, undefined> {
  const subtableFields = schema.fields.flatMap((field) =>
    field.type === "SUBTABLE" ? [field] : [],
  );

  for (const subtableField of subtableFields) {
    // pick rows which contains subtable related fields
    const subtableRows = rows.filter(
      (row) =>
        (subtableField.code in row && row[subtableField.code].length > 0) ||
        subtableField.fields.some(
          ({ code }) => code in row && row[code].length > 0,
        ),
    );

    if (subtableRows.length > 0) {
      yield {
        code: subtableField.code,
        rows: subtableRows,
        fields: subtableField.fields,
      };
    }
  }
}

type SubtableRow = {
  id: string;
  row: CsvRow;
  fields: InSubtable[];
};

const convertSubtableRow = (
  subtableRow: SubtableRow,
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
  subtableField: SubtableField,
): Generator<SubtableRow, void, undefined> {
  for (const row of subtableField.rows) {
    yield { id: row[subtableField.code], row, fields: subtableField.fields };
  }
}

type FieldInSubtable = {
  code: string;
  value: string;
  type: InSubtable["type"];
};
const convertFieldInSubtable = (
  fieldInSubtable: FieldInSubtable,
): Fields.InSubtable => {
  return convertFieldValue(fieldInSubtable) as Fields.InSubtable;
};

// eslint-disable-next-line func-style
function* fieldInSubtableReader({
  row,
  fields,
}: SubtableRow): Generator<FieldInSubtable, void, undefined> {
  for (const fieldInSubtable of fields) {
    if (!(fieldInSubtable.code in row)) {
      continue;
    }

    yield {
      code: fieldInSubtable.code,
      value: row[fieldInSubtable.code],
      type: fieldInSubtable.type,
    };
  }
}

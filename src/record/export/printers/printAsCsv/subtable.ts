import * as Fields from "../../types/field";
import { KintoneRecord } from "../../types/record";
import { CsvRow, FieldsJson } from "../../../../kintone/types";
import { convertFieldValue } from "./fieldValue";
import { supportedFieldTypesInSubtable } from "./constants";

type SubtableField = {
  code: string;
  value: Fields.Subtable;
};

export const hasSubtable = (fieldsJson: FieldsJson) =>
  Object.values(fieldsJson.properties).some(
    (field) => field.type === "SUBTABLE"
  );

export const convertSubtableField = (
  field: SubtableField,
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): CsvRow[] => {
  const subtableRows: CsvRow[] = [];
  for (const row of subtableRowReader(field)) {
    subtableRows.push(
      convertSubtableRow(row, field.code, fieldsJson, attachmentsDir)
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
      continue; // TODO: error
    }
    yield { code, value: record[code] as Fields.Subtable };
  }
}

type SubtableRow = Fields.Subtable["value"][number];

const convertSubtableRow = (
  subtableRow: SubtableRow,
  subtableFieldCode: string,
  fieldsJson: FieldsJson,
  attachmentsDir?: string
): CsvRow => {
  const newRow: CsvRow = {
    [subtableFieldCode]: subtableRow.id,
  };
  for (const fieldsInSubtable of fieldsInSubtableReader(
    subtableRow,
    subtableFieldCode,
    fieldsJson
  )) {
    newRow[fieldsInSubtable.code] = convertFieldInSubtable(
      fieldsInSubtable,
      attachmentsDir
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
  attachmentsDir?: string
): string => {
  return convertFieldValue(fieldInSubtable.value, attachmentsDir);
};

// eslint-disable-next-line func-style
function* fieldsInSubtableReader(
  subtableRow: SubtableRow,
  subtableFieldCode: string,
  fieldsJson: FieldsJson
): Generator<FieldInSubtable, void, undefined> {
  const subtableFieldProperty = fieldsJson.properties[subtableFieldCode];
  if (subtableFieldProperty.type !== "SUBTABLE") {
    throw new Error("Illegal state"); // TODO: error message
  }

  for (const [fieldCodeInSubtable, fieldPropertyInSubtable] of Object.entries(
    subtableFieldProperty.fields
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

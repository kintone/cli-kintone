import type { CsvRow } from "../../../../kintone/types";
import type * as Fields from "../../types/field";
import type { FieldSchema, RecordSchema } from "../../types/schema";

import { convertFieldValue } from "./fieldValue";

type Field = {
  code: string;
  value: string;
  type: FieldSchema["type"];
};

export const convertField = (field: Field): Fields.OneOf => {
  return convertFieldValue(field);
};

// eslint-disable-next-line func-style
export function* fieldReader(
  row: CsvRow,
  schema: RecordSchema
): Generator<Field, void, undefined> {
  for (const field of schema.fields) {
    if (field.type === "SUBTABLE") {
      continue;
    }
    // detect empty row by length of string
    // because CsvRow contains all properties defined in header row
    if (row[field.code].length === 0) {
      continue;
    }
    yield { code: field.code, value: row[field.code], type: field.type };
  }
}

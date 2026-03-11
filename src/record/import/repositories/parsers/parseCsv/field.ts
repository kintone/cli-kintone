import type { CsvRow } from "../../../../../kintone/types.js";
import type * as Fields from "../../../types/field.js";
import type { FieldSchema, RecordSchema } from "../../../types/schema.js";

import { convertFieldValue } from "./fieldValue.js";

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
  schema: RecordSchema,
): Generator<Field, void, undefined> {
  for (const field of schema.fields) {
    if (field.type === "SUBTABLE") {
      continue;
    }
    if (!(field.code in row)) {
      continue;
    }
    yield { code: field.code, value: row[field.code], type: field.type };
  }
}

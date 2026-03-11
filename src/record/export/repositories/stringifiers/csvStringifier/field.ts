import type { LocalRecord } from "../../../types/record.js";
import type * as Fields from "../../../types/field.js";
import type { RecordSchema } from "../../../types/schema.js";

import { convertFieldValue } from "./fieldValue.js";

type Field = {
  code: string;
  value: Fields.OneOf;
};

export const convertField = (
  field: Field,
  useLocalFilePath: boolean,
): string => {
  return convertFieldValue(field.value, useLocalFilePath);
};

// eslint-disable-next-line func-style
export function* fieldReader(
  record: LocalRecord,
  schema: RecordSchema,
): Generator<Field, void, undefined> {
  for (const field of schema.fields) {
    if (field.type === "SUBTABLE") {
      continue;
    }

    if (!(field.code in record)) {
      throw new Error(`The record is missing a field (${field.code})`);
    }
    yield { code: field.code, value: record[field.code] };
  }
}

import type { RecordSchema } from "../../../types/schema";
import { PRIMARY_MARK } from "./constants";

export const buildHeaderFields = (schema: RecordSchema): string[] => {
  const headerFields: string[] = [];

  if (schema.hasSubtable) {
    headerFields.push(PRIMARY_MARK);
  }

  for (const field of schema.fields) {
    headerFields.push(field.code);

    if (field.type === "SUBTABLE") {
      for (const fieldInSubtable of field.fields) {
        headerFields.push(fieldInSubtable.code);
      }
    }
  }

  return headerFields;
};

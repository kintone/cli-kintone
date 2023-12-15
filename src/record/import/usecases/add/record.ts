import type { KintoneRecordForParameter } from "../../../../kintone/types";
import type { LocalRecord } from "../../types/record";
import type * as Fields from "../../types/field";
import type { FieldSchema, InSubtable, RecordSchema } from "../../types/schema";
import type { SubtableRow } from "../../types/field";
import { Subtable } from "../../types/field";

export const recordConverter: (
  record: LocalRecord,
  schema: RecordSchema,
  skipMissingFields: boolean,
  task: (
    field: Fields.OneOf,
    fieldSchema: FieldSchema,
  ) => Promise<KintoneRecordForParameter[string]>,
) => Promise<KintoneRecordForParameter> = async (
  record,
  schema,
  skipMissingFields,
  task,
) => {
  const newRecord: KintoneRecordForParameter = {};
  for (const fieldSchema of schema.fields) {
    if (!(fieldSchema.code in record.data)) {
      if (skipMissingFields) {
        continue;
      } else {
        throw new Error(
          `The specified field "${fieldSchema.code}" does not exist on the CSV`,
        );
      }
    }
    if (fieldSchema.type === "SUBTABLE") {
      // @ts-ignore
      record.data[fieldSchema.code].value = setEmptyValueToTableField(
        record.data[fieldSchema.code].value as Fields.SubtableRow[],
        fieldSchema,
      );
    }

    newRecord[fieldSchema.code] = await task(
      record.data[fieldSchema.code],
      fieldSchema,
    );
  }
  return newRecord;
};

const setEmptyValueToTableField = (
  rowsInTable: Fields.SubtableRow[],
  fieldSchema: FieldSchema,
) => {
  rowsInTable.forEach(function (
    element: Fields.SubtableRow,
    index: number,
    array: Fields.SubtableRow[],
  ) {
    if ("fields" in fieldSchema) {
      fieldSchema.fields.forEach((field: InSubtable) => {
        if (element.value[field.code as any] === undefined) {
          array[index].value[field.code] = "";
        }
      });
    }
  });

  return rowsInTable;
};

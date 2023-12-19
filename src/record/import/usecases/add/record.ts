import type { KintoneRecordForParameter } from "../../../../kintone/types";
import type { LocalRecord } from "../../types/record";
import type * as Fields from "../../types/field";
import type { FieldSchema, RecordSchema } from "../../types/schema";

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
    newRecord[fieldSchema.code] = await task(
      record.data[fieldSchema.code],
      fieldSchema,
    );
  }
  return newRecord;
};

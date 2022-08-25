import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import { parseJson } from "./parseJson";
import { parseCsv } from "./parseCsv";

export const parseRecords: (options: {
  source: string;
  format: string;
  schema: RecordSchema;
}) => Promise<KintoneRecord[]> = async (options) => {
  const { source, format, schema } = options;
  switch (format) {
    case "json":
      return parseJson(source); // TODO: filter fields by the schema
    case "csv":
      return parseCsv(source, schema);
    default:
      throw new Error(`Unexpected file type: ${format} is unacceptable.`);
  }
};

import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import { parseCsv } from "./parseCsv";
import { ParserError } from "./error";

export const parseRecords: (options: {
  source: string;
  format: string;
  schema: RecordSchema;
}) => Promise<KintoneRecord[]> = async (options) => {
  const { source, format, schema } = options;
  switch (format) {
    case "csv":
      return parseCsv(source, schema);
    default:
      throw new ParserError(`Unexpected file type: ${format} is unacceptable.`);
  }
};

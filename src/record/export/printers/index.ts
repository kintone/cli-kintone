import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import { printAsJson } from "./printAsJson";
import { printAsCsv } from "./printAsCsv";

export type ExportFileFormat = "csv" | "json";

export const printRecords: (options: {
  records: KintoneRecord[];
  schema: RecordSchema;
  format?: ExportFileFormat;
  useLocalFilePath: boolean;
}) => void = async (options) => {
  const { records, schema, format, useLocalFilePath } = options;
  switch (format) {
    case "json": {
      printAsJson(records);
      break;
    }
    case "csv": {
      printAsCsv(records, schema, useLocalFilePath);
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
};

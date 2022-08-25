import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import iconv from "iconv-lite";

import { stringifyAsJson } from "./stringifyAsJson";
import { stringifyAsCsv } from "./stringifyAsCsv";

export type ExportFileFormat = "csv" | "json";
export type ExportFileEncoding = "utf8" | "sjis";

export const printRecords: (options: {
  records: KintoneRecord[];
  schema: RecordSchema;
  format?: ExportFileFormat;
  encoding?: ExportFileEncoding;
  useLocalFilePath: boolean;
}) => void = (options) => {
  const { format = "csv", encoding = "utf8" } = options;
  validateOptions({ format, encoding });
  const recordsString = stringifyRecords(options);
  process.stdout.write(iconv.encode(recordsString, encoding));
};

const validateOptions = (options: {
  format: ExportFileFormat;
  encoding: ExportFileEncoding;
}) => {
  if (options.format === "json" && options.encoding === "sjis") {
    throw new Error(
      "When the output format is JSON, the encoding MUST be UTF-8"
    );
  }
};

const stringifyRecords = (options: {
  records: KintoneRecord[];
  schema: RecordSchema;
  format?: ExportFileFormat;
  useLocalFilePath: boolean;
}) => {
  const { records, schema, format, useLocalFilePath } = options;
  switch (format) {
    case "json": {
      return stringifyAsJson(records);
    }
    case "csv": {
      return stringifyAsCsv(records, schema, useLocalFilePath);
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
};

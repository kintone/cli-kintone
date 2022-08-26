import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import iconv from "iconv-lite";

import { stringifyAsJson } from "./stringifyAsJson";
import { stringifyAsCsv } from "./stringifyAsCsv";

export type ExportFileFormat = "csv" | "json";
export type ExportFileEncoding = "utf8" | "sjis";

export const stringifyRecords: (options: {
  records: KintoneRecord[];
  schema: RecordSchema;
  format?: ExportFileFormat;
  encoding?: ExportFileEncoding;
  useLocalFilePath: boolean;
}) => Buffer = (options) => {
  const {
    records,
    schema,
    format = "csv",
    encoding = "utf8",
    useLocalFilePath,
  } = options;
  validateOptions({ format, encoding });

  let recordsString: string;
  switch (format) {
    case "json": {
      recordsString = stringifyAsJson(records);
      break;
    }
    case "csv": {
      recordsString = stringifyAsCsv(records, schema, useLocalFilePath);
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
  return iconv.encode(recordsString, encoding);
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

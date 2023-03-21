import type { KintoneRecord } from "../types/record.js";
import type { RecordSchema } from "../types/schema.js";

import { stringifyAsJson } from "./stringifyAsJson.js";
import { stringifyAsCsv } from "./stringifyAsCsv/index.js";

export type ExportFileFormat = "csv" | "json";

type Stringifier = (records: KintoneRecord[]) => string;

type FactoryOptions =
  | {
      format: "csv";
      schema: RecordSchema;
      useLocalFilePath: boolean;
    }
  | {
      format: "json";
    };

export const stringifierFactory = (options: FactoryOptions): Stringifier => {
  switch (options.format) {
    case "json":
      return stringifyAsJson;
    case "csv":
      return (records) =>
        stringifyAsCsv(records, options.schema, options.useLocalFilePath);
    default:
      throw new Error(`Unknown format type.`);
  }
};

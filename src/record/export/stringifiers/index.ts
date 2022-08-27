import type { KintoneRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import { stringifyAsJson } from "./stringifyAsJson";
import { stringifyAsCsv } from "./stringifyAsCsv";

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

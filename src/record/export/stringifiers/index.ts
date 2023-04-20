import type { LocalRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";

import { jsonStringifier } from "./JsonStringifier";
import { CsvStringifier } from "./csvStringifier";

export type ExportFileFormat = "csv" | "json";

export type Stringifier = {
  readonly stringify: (input: LocalRecord[]) => Promise<string>;
};

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
      return jsonStringifier;
    case "csv":
      return new CsvStringifier(options.schema, options.useLocalFilePath);
    default:
      throw new Error(`Unknown format type.`);
  }
};

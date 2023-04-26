import type { LocalRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";

import { CsvStringifier } from "./csvStringifier";

export type ExportFileFormat = "csv";

export type Stringifier = {
  readonly stringify: (input: LocalRecord[]) => Promise<string>;
};

type FactoryOptions = {
  format: "csv";
  schema: RecordSchema;
  useLocalFilePath: boolean;
};

export const stringifierFactory = (options: FactoryOptions): Stringifier => {
  switch (options.format) {
    case "csv":
      return new CsvStringifier(options.schema, options.useLocalFilePath);
    default:
      throw new Error(`Unknown format type.`);
  }
};

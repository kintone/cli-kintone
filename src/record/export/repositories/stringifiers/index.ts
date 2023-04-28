import type { RecordSchema } from "../../types/schema";

import { CsvStringifier } from "./csvStringifier";
import type { Duplex } from "stream";

export type Stringifier = Duplex;

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

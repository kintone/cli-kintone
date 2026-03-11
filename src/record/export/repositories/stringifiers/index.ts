import type { RecordSchema } from "../../types/schema.js";

import { CsvStringifier } from "./csvStringifier/index.js";
import type { LocalRecord } from "../../types/record.js";

export type Stringifier = {
  write(records: LocalRecord[]): Promise<void>;
  read(size?: number): string;
  end(): Promise<void>;
  pipe<T extends NodeJS.WritableStream>(destination: T): void;
  [Symbol.asyncIterator](): AsyncIterableIterator<string>;
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

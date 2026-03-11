import type { RecordNumber } from "../types/field.js";

import { parseCsv } from "./parseCsv/index.js";
import { ParserError } from "./error.js";

export const parseRecords: (options: {
  source: string;
  format: string;
  recordNumberFieldCode: string;
}) => Promise<RecordNumber[]> = async (options) => {
  const { source, format, recordNumberFieldCode } = options;
  switch (format) {
    case "csv":
      return parseCsv(source, recordNumberFieldCode);
    default:
      throw new ParserError(`Unexpected file type: ${format} is unacceptable.`);
  }
};

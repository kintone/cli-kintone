import type { CsvRow } from "../../../../kintone/types.js";
import type { RecordNumber } from "../../types/field.js";

import { parse as csvParse } from "csv-parse/sync";
import { getRecordNumberFromCsvRows } from "./record.js";
import { SEPARATOR } from "./constants.js";
import { ParserError } from "../error.js";

export const parseCsv: (
  csv: string,
  recordNumberFieldCode: string,
) => RecordNumber[] = (csv, recordNumberFieldCode) => {
  let rows: CsvRow[] = [];
  try {
    rows = csvParse(csv, {
      columns: true,
      skip_empty_lines: true,
      delimiter: SEPARATOR,
    });
  } catch (e) {
    throw new ParserError(e);
  }

  if (rows.length === 0) {
    return [];
  }
  if (!isMatchedRecordNumberFieldCode(rows[0], recordNumberFieldCode)) {
    throw new ParserError(
      `The record number field code (${recordNumberFieldCode}) is not found.`,
    );
  }

  return getRecordNumberFromCsvRows(rows, recordNumberFieldCode);
};

const isMatchedRecordNumberFieldCode = (
  row: CsvRow,
  recordNumberFieldCode: string,
): boolean => !!row[recordNumberFieldCode];

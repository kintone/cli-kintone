import type { CsvRow } from "../../../../kintone/types";
import { PRIMARY_MARK } from "./constants";
import type { RecordNumber } from "../../types/field";

export const getRecordNumberFromCsvRows = (
  rows: CsvRow[],
  recordNumberFieldCode: string
): RecordNumber[] => {
  if (rows.length === 0) {
    return [];
  }

  const filteredRows = filterPrimaryRows(rows);

  return filteredRows.map((record: CsvRow): RecordNumber => {
    return { value: record[recordNumberFieldCode] };
  });
};

const filterPrimaryRows = (rows: CsvRow[]): CsvRow[] => {
  const hasSubtableField = hasSubtable(rows[0]);
  const records: CsvRow[] = [];
  for (let index = 0; index < rows.length; index++) {
    if (
      !hasSubtableField ||
      (hasSubtableField && isPrimaryCsvRow(rows[index]))
    ) {
      records.push(rows[index]);
    }
  }

  return records;
};

const hasSubtable = (row: CsvRow): boolean => PRIMARY_MARK in row;

const isPrimaryCsvRow = (row: CsvRow): boolean => !!row[PRIMARY_MARK];

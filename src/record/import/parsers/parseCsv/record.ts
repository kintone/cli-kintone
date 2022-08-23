import type { CsvRow } from "../../../../kintone/types";
import type { KintoneRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";

import { convertField, fieldReader } from "./field";
import { convertSubtableField, subtableFieldReader } from "./subtable";
import { PRIMARY_MARK } from "./constants";

type RecordCsv = CsvRow[];

export const convertRecord = (
  recordCsv: RecordCsv,
  schema: RecordSchema
): KintoneRecord => {
  const record: KintoneRecord = {};
  for (const field of fieldReader(recordCsv[0], schema)) {
    record[field.code] = convertField(field);
  }
  for (const subtableField of subtableFieldReader(recordCsv, schema)) {
    record[subtableField.code] = convertSubtableField(subtableField);
  }
  return record;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export function* recordReader(
  rows: CsvRow[]
): Generator<RecordCsv, void, undefined> {
  if (!hasSubtable(rows[0])) {
    yield* rows.map((row) => [row]);
    return;
  }

  let index = 0;
  while (index < rows.length) {
    let first = index;
    let last = first;

    // skip to the first primary mark
    while (first < rows.length && !isPrimaryCsvRow(rows[first])) {
      first++;
    }

    // find the row just before the next primary mark
    while (last + 1 < rows.length && !isPrimaryCsvRow(rows[last + 1])) {
      last++;
    }

    yield rows.slice(first, last + 1);

    index = last + 1;
  }
}

const hasSubtable = (row: CsvRow): boolean => PRIMARY_MARK in row;

const isPrimaryCsvRow = (row: CsvRow): boolean => !!row[PRIMARY_MARK];

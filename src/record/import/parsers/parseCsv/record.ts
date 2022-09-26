import type { CsvRow } from "../../../../kintone/types";
import type { KintoneRecord } from "../../types/record";
import type { RecordSchema } from "../../types/schema";

import { convertField, fieldReader } from "./field";
import { convertSubtableField, subtableFieldReader } from "./subtable";
import { PRIMARY_MARK } from "./constants";

type RecordCsv = {
  rows: CsvRow[];
  firstRowIndex: number;
  lastRowIndex: number;
};

export const convertRecord = (
  recordCsv: RecordCsv,
  schema: RecordSchema
): KintoneRecord => {
  const recordData: KintoneRecord["data"] = {};
  for (const field of fieldReader(recordCsv.rows[0], schema)) {
    recordData[field.code] = convertField(field);
  }
  for (const subtableField of subtableFieldReader(recordCsv.rows, schema)) {
    recordData[subtableField.code] = convertSubtableField(subtableField);
  }
  return {
    data: recordData,
    metadata: {
      format: {
        type: "csv",
        firstRowIndex: recordCsv.firstRowIndex,
        lastRowIndex: recordCsv.lastRowIndex,
      },
    },
  };
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#use_of_the_yield_keyword
// eslint-disable-next-line func-style
export function* recordReader(
  rows: CsvRow[]
): Generator<RecordCsv, void, undefined> {
  if (rows.length === 0) {
    return;
  }

  const lineOffset = 1; // offset the header row

  if (!hasSubtable(rows[0])) {
    yield* rows.map<RecordCsv>((row, index) => ({
      rows: [row],
      firstRowIndex: index + lineOffset,
      lastRowIndex: index + lineOffset,
    }));
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

    yield {
      rows: rows.slice(first, last + 1),
      firstRowIndex: first + lineOffset,
      lastRowIndex: last + lineOffset,
    };

    index = last + 1;
  }
}

const hasSubtable = (row: CsvRow): boolean => PRIMARY_MARK in row;

const isPrimaryCsvRow = (row: CsvRow): boolean => !!row[PRIMARY_MARK];

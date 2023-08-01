import type { CsvRow } from "../../../../../kintone/types";
import type { LocalRecord } from "../../../types/record";
import type { RecordSchema } from "../../../types/schema";

import { convertField, fieldReader } from "./field";
import { convertSubtableField, subtableFieldReader } from "./subtable";
import { PRIMARY_MARK } from "./constants";
import type csvParse from "csv-parse";
import { Readable } from "stream";
import { withIndex, withNext } from "../../../../../utils/iterator";

type RecordCsv = {
  rows: CsvRow[];
  firstRowIndex: number;
  lastRowIndex: number;
};

export const convertRecord = (
  recordCsv: RecordCsv,
  schema: RecordSchema,
): LocalRecord => {
  const recordData: LocalRecord["data"] = {};
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
export async function* recordReader(
  csvStream: csvParse.Parser,
): AsyncGenerator<RecordCsv, void, undefined> {
  const lineOffset = 1; // offset the header row

  const { value: firstRow }: { value: CsvRow | null } = await csvStream[
    Symbol.asyncIterator
  ]().next();

  if (firstRow === null || firstRow === undefined) {
    return;
  }

  const stream = unshiftToStream(csvStream, firstRow);
  const generator = withIndex(withNext<CsvRow>(stream[Symbol.asyncIterator]()));

  if (!hasSubtable(firstRow)) {
    for await (const {
      data: { current: row },
      index: rowIndex,
    } of generator) {
      yield {
        rows: [row],
        firstRowIndex: rowIndex + lineOffset,
        lastRowIndex: rowIndex + lineOffset,
      };
    }
    return;
  }

  let rows: CsvRow[] = [];
  let firstRowIndex = 0;

  for await (const {
    data: { current: currentRow, next: nextRow },
    index: rowIndex,
  } of generator) {
    rows.push(currentRow);
    if (nextRow === undefined || isPrimaryCsvRow(nextRow)) {
      if (rows.length > 0 && isPrimaryCsvRow(rows[0])) {
        yield {
          rows: rows,
          firstRowIndex: firstRowIndex + lineOffset,
          lastRowIndex: rowIndex + lineOffset,
        };
      }
      firstRowIndex = rowIndex + 1;
      rows = [];
    }
  }
}

const hasSubtable = (row: CsvRow): boolean => PRIMARY_MARK in row;

const isPrimaryCsvRow = (row: CsvRow): boolean => !!row[PRIMARY_MARK];

const unshiftToStream = (stream: Readable, element: unknown) =>
  Readable.from(
    (async function* () {
      yield element;
      yield* stream;
    })(),
  );

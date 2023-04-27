import type { LocalRecord } from "../../../../../types/record";

export const input: LocalRecord[] = [
  {
    レコード番号: {
      type: "RECORD_NUMBER",
      value: "1",
    },
    文字列__1行_: {
      type: "SINGLE_LINE_TEXT",
      value: "文字列１２３",
    },
    作成日時: {
      type: "CREATED_TIME",
      value: "2022-05-02T07:58:00Z",
    },
  },
  {
    レコード番号: {
      type: "RECORD_NUMBER",
      value: "2",
    },
    文字列__1行_: {
      type: "SINGLE_LINE_TEXT",
      value: "文字列２３４",
    },
    作成日時: {
      type: "CREATED_TIME",
      value: "2022-05-02T07:58:00Z",
    },
  },
  {
    レコード番号: {
      type: "RECORD_NUMBER",
      value: "3",
    },
    文字列__1行_: {
      type: "SINGLE_LINE_TEXT",
      value: "文字列３４５",
    },
    作成日時: {
      type: "CREATED_TIME",
      value: "2022-05-02T07:58:00Z",
    },
  },
];

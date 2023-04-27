import type { LocalRecord } from "../../../../../types/record";

export const input: LocalRecord[] = [
  {
    レコード番号: {
      type: "RECORD_NUMBER",
      value: "1",
    },
    更新者: {
      type: "MODIFIER",
      value: {
        code: "tasshi",
        name: "tasshi",
      },
    },
    作成者: {
      type: "CREATOR",
      value: {
        code: "tasshi",
        name: "tasshi",
      },
    },
    文字列__1行_: {
      type: "SINGLE_LINE_TEXT",
      value: "文字列１２３",
    },
    ラジオボタン: {
      type: "RADIO_BUTTON",
      value: "選択肢1",
    },
    更新日時: {
      type: "UPDATED_TIME",
      value: "2022-05-02T07:58:00Z",
    },
    作成日時: {
      type: "CREATED_TIME",
      value: "2022-05-02T07:58:00Z",
    },
  },
];

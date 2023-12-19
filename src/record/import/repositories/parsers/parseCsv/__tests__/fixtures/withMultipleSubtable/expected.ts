import type { LocalRecord } from "../../../../../../types/record";

export const expected: LocalRecord[] = [
  {
    data: {
      text: {
        value: "sample1",
      },
      subTable: {
        value: [
          {
            id: "100",
            value: {
              textInSubtable: {
                value: "alice",
              },
              numberInSubtable: {
                value: "10",
              },
            },
          },
          {
            id: "101",
            value: {
              textInSubtable: {
                value: "bob",
              },
              numberInSubtable: {
                value: "20",
              },
            },
          },
        ],
      },
      subTable2: {
        value: [
          {
            id: "200",
            value: {
              textInSubtable2: {
                value: "hoge1",
              },
              numberInSubtable2: {
                value: "10",
              },
            },
          },
          {
            id: "201",
            value: {
              textInSubtable2: {
                value: "hoge2",
              },
              numberInSubtable2: {
                value: "20",
              },
            },
          },
        ],
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 1, lastRowIndex: 4 },
    },
  },
  {
    data: {
      text: { value: "sample1" },
      subTable: {
        value: [
          {
            id: "102",
            value: {
              numberInSubtable: {
                value: "",
              },
              textInSubtable: {
                value: "",
              },
            },
          },
        ],
      },
      subTable2: {
        value: [
          {
            id: "202",
            value: {
              numberInSubtable2: {
                value: "",
              },
              textInSubtable2: {
                value: "",
              },
            },
          },
        ],
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 5, lastRowIndex: 6 },
    },
  },
  {
    data: {
      text: { value: "sample1" },
      subTable: {
        value: [
          {
            id: "",
            value: {
              numberInSubtable: {
                value: "",
              },
              textInSubtable: {
                value: "carol",
              },
            },
          },
        ],
      },
      subTable2: {
        value: [
          {
            id: "",
            value: {
              numberInSubtable2: {
                value: "30",
              },
              textInSubtable2: {
                value: "",
              },
            },
          },
        ],
      },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 7, lastRowIndex: 8 },
    },
  },
  {
    data: {
      text: { value: "sample1" },
    },
    metadata: {
      format: { type: "csv", firstRowIndex: 9, lastRowIndex: 9 },
    },
  },
];

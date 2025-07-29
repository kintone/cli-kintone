import type { TestPattern } from "../../index.test";

export const expected: TestPattern["expected"] = {
  success: {
    requests: [
      {
        type: "add",
        payload: {
          app: "1",
          records: [
            {
              singleLineText: {
                value: "value11",
              },
              number: {
                value: "11",
              },
            },
            {
              singleLineText: {
                value: "value22",
              },
              number: {
                value: "22",
              },
            },
            {
              singleLineText: {
                value: "value33",
              },
              number: {
                value: "33",
              },
            },
          ],
        },
      },
      {
        type: "update",
        payload: {
          app: "1",
          records: [
            {
              id: "1",
              record: {
                number: {
                  value: "1",
                },
                singleLineText: {
                  value: "value1",
                },
              },
            },
            {
              id: "2",
              record: {
                number: {
                  value: "2",
                },
                singleLineText: {
                  value: "value2",
                },
              },
            },
          ],
        },
      },
      {
        type: "add",
        payload: {
          app: "1",
          records: [
            {
              singleLineText: {
                value: "value44",
              },
              number: {
                value: "44",
              },
            },
            {
              singleLineText: {
                value: "value55",
              },
              number: {
                value: "55",
              },
            },
          ],
        },
      },
    ],
  },
};

import type { TestPattern } from "../../index.test";

export const expected: TestPattern["expected"] = {
  success: {
    requests: [
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
                value: "value3",
              },
              number: {
                value: "3",
              },
            },
          ],
        },
      },
    ],
  },
};

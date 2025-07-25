import type { TestPattern } from "../../index.test";

export const expected: TestPattern["expected"] = {
  success: {
    requests: [
      {
        type: "update",
        payload: {
          app: "1",
          upsert: true,
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
              id: "3",
              record: {
                number: {
                  value: "3",
                },
                singleLineText: {
                  value: "value3",
                },
              },
            },
          ],
        },
      },
    ],
  },
};

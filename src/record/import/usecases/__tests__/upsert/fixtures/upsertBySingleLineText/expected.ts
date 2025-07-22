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
              updateKey: {
                field: "singleLineText",
                value: "value1",
              },
              record: {
                number: {
                  value: "1",
                },
                date: {
                  value: "2022-03-01",
                },
                singleLineText_nonUnique: {
                  value: "value1",
                },
              },
            },
            {
              updateKey: {
                field: "singleLineText",
                value: "value3",
              },
              record: {
                number: {
                  value: "3",
                },
                date: {
                  value: "2022-04-01",
                },
                singleLineText_nonUnique: {
                  value: "value1",
                },
              },
            },
          ],
        },
      },
    ],
  },
};

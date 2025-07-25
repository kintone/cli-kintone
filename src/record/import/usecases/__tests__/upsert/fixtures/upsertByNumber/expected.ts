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
                field: "number",
                value: "1",
              },
              record: {
                singleLineText: {
                  value: "value1",
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
                field: "number",
                value: "3",
              },
              record: {
                singleLineText: {
                  value: "value3",
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

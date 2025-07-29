import type { TestPattern } from "../../index.test";

export const expected: TestPattern["expected"] = {
  success: {
    requests: [
      // Records for update should not include a Record Number field
      {
        type: "update",
        payload: {
          app: "1",
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
              },
            },
          ],
        },
      },
      // Records for add should not include a Record Number field
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

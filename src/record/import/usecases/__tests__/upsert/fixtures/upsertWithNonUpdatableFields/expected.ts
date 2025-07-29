import type { TestPattern } from "../../index.test";

export const expected: TestPattern["expected"] = {
  success: {
    requests: [
      // Record for update should not include non-updatable fields
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
      // Record for add should include non-updatable fields
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
              creator: {
                value: {
                  code: "creator3",
                },
              },
              modifier: {
                value: {
                  code: "modifier3",
                },
              },
              createdTime: { value: "2021-02-16T02:43:00Z" },
              updatedTime: { value: "2022-03-27T03:54:00Z" },
            },
          ],
        },
      },
    ],
  },
};

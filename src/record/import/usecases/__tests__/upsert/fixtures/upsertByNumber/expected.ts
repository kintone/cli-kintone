import { TestPattern } from "../../index.test";

export const expected: TestPattern["expected"] = {
  success: {
    forUpdate: {
      app: "1",
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
      ],
    },
    forAdd: {
      app: "1",
      records: [
        {
          singleLineText: {
            value: "value3",
          },
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
      ],
    },
  },
};

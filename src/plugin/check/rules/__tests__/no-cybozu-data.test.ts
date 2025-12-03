import { RuleTester } from "eslint";
import noCybozuData from "../no-cybozu-data";

const tester = new RuleTester();
tester.run("no-cybozu-data", noCybozuData, {
  valid: [`const foo = 123;`, `const foo = foo.bar;`],
  invalid: [
    {
      code: `const foo = cybozu.data`,
      errors: [{ message: "Accessing `cybozu.data` is not allowed." }],
    },
    {
      code: `const foo = cybozu.data.abc`,
      errors: [{ message: "Accessing `cybozu.data` is not allowed." }],
    },
    {
      code: `const foo = cybozu.data['abc']`,
      errors: [{ message: "Accessing `cybozu.data` is not allowed." }],
    },
    {
      code: `cybozu.data = 123`,
      errors: [{ message: "Accessing `cybozu.data` is not allowed." }],
    },
    {
      code: `cybozu.data.abc = 123`,
      errors: [{ message: "Accessing `cybozu.data` is not allowed." }],
    },
  ],
});

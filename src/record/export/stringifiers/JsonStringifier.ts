import type { Stringifier } from "./index";

export const jsonStringifier: Stringifier = {
  stringify: async (records) => {
    return JSON.stringify(records, null, 2);
  },
};

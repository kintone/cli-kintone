import { select } from "@inquirer/prompts";
import type { BoundMessage } from "../../core";

export const promptForScope = async (m: BoundMessage) => {
  return select({
    message: m("Q_Scope"),
    choices: [
      { name: "ALL", value: "ALL" },
      { name: "ADMIN", value: "ADMIN" },
      { name: "NONE", value: "NONE" },
    ],
  });
};

import { When } from "@cucumber/cucumber";
import { execCliKintoneSync } from "../ultils/helper";

When("I run the command with args {string}", function (args: string) {
  this.response = execCliKintoneSync(args);
});

import * as assert from "assert";
import { Then, When } from "@cucumber/cucumber";
import { execCliKintoneSync } from "../ultils/helper";

When("I run the command with args {string}", function (args: string) {
  this.response = execCliKintoneSync(args);
});

Then("I should get the exit code is non-zero", function () {
  assert.notEqual(this.response.status, 0);
});

Then("The out error message is {string}", function (errorMessage: string) {
  assert.ok(this.response.stderr.toString().includes(errorMessage));
});

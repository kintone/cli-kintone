import * as assert from "assert";
import { execCliKintoneSync, replaceTokenWithEnvVars } from "../ultils/helper";
import { When, Then } from "../ultils/world";

When("I run the command with args {string}", function (args: string) {
  this.response = execCliKintoneSync(replaceTokenWithEnvVars(args));
});

Then("I should get the exit code is non-zero", function () {
  assert.notEqual(this.response.status, 0);
});

Then("I should get the exit code is zero", function () {
  assert.equal(this.response.status, 0);
});

Then(
  "The output error message should match with the pattern: {string}",
  function (errorMessage: string) {
    const reg = new RegExp(errorMessage);
    assert.match(this.response.stderr, reg);
  },
);

Then(
  "The output message should match with the pattern: {string}",
  function (message: string) {
    const reg = new RegExp(message);
    assert.match(this.response.stdout, reg);
  },
);

import { Then, When } from "@cucumber/cucumber";
import { execCliKintoneSync, replaceTokenWithEnvVars } from "../ultils/helper";
import * as assert from "assert";

When("I run the command with args {string}", function (args: string) {
  this.response = execCliKintoneSync(args);
});

When(
  "I run the command with subcommand {string} and args {string}",
  function (subcommand: string, args: string) {
    const _args = `${subcommand} ${replaceTokenWithEnvVars(args)}`;
    this.response = execCliKintoneSync(_args);
  }
);

Then(
  "I should get the output including the {string}",
  function (expected: string) {
    console.log(this.response.stderr);
    assert.match(this.response.stdout, new RegExp(`.*${expected}.*`));
  }
);

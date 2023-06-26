import * as assert from "assert";
import { When, Then } from "@cucumber/cucumber";
import { execCliKintoneSync } from "../ultils/helper";

When("I run the command with args {string}", function (args: string) {
  this.response = execCliKintoneSync(args);
});

Then(
  "I should get the version formatted in {string}",
  function (versionFormat: string) {
    const reg = new RegExp(versionFormat);
    assert.match(this.response.stdout, reg);
  }
);

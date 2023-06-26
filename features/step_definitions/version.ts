import * as assert from "assert";
import { When, Then } from "@cucumber/cucumber";
import { executeCommand, getCliKintoneBinary } from "../ultils/helper";

When("I run the command with args {string}", async function (args: string) {
  this.response = await executeCommand(`${getCliKintoneBinary()} ${args}`);
});

Then(
  "I should get the version formatted in {string}",
  function (versionFormat: string) {
    console.log(versionFormat);
    const reg = new RegExp(versionFormat);
    assert.match(this.response.stdout, reg);
  }
);

import * as assert from "assert";
import { Then, When } from "../utils/world";
import { waitUntil } from "../utils/helper";

Then("The app {string} should have no records", function (appKey) {
  const recordNumbers = this.getRecordNumbersByAppKey(appKey);
  assert.equal(recordNumbers.length, 0, "The app is not empty");
});

Then(
  "The app {string} with the record number field code {string} should have {int} records",
  function (appKey: string, fieldCode: string, numberOfRecords: number) {
    const recordNumbers = this.getRecordNumbersByAppKey(appKey, fieldCode);
    assert.equal(recordNumbers.length, numberOfRecords);
  },
);

When("I run the delete command with args {string}", function (args: string) {
  this.execCliKintone(args);
});

When("I type {string}", function (userInput) {
  this.childProcess.stdin.write(userInput);
});

When("I press Enter", async function () {
  this.childProcess.stdin.write("\n");
  this.childProcess.stdin.end();
  await waitUntil(() => this.childProcess.exitCode !== null);
});

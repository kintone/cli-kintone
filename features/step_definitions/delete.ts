import * as assert from "assert";
import { Then } from "../utils/world";

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

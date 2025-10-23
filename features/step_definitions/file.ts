import { Then } from "../utils/world";
import * as assert from "assert";

Then("I have a file at {string}", async function (filePath: string) {
  assert.ok(await this.isFileExists(filePath));
});

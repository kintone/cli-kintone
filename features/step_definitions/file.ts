import { Then } from "../utils/world";
import * as assert from "assert";
import fs from "fs/promises";

Then("I have a file at {string}", async function (filePath: string) {
  assert.ok((await fs.stat(filePath)).isFile());
});

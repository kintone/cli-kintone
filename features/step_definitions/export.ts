import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";
import path from "path";

Given("I have a directory {string}", function (directory: string) {
  fs.mkdirSync(path.join(this.workingDir, directory));
});

Then(
  "The directory {string} should contain files as below:",
  function (attachmentDir, table) {
    const columns: string[] = table.raw()[0];
    const requiredColumns = ["FilePath", "FileName", "Content"];
    requiredColumns.forEach((requiredColumn) => {
      if (!columns.includes(requiredColumn)) {
        throw new Error(`The table should have ${requiredColumn} column.`);
      }
    });

    const records: Array<{ [key: string]: string }> =
      this.replacePlaceholdersInHashesDataTables(table.hashes());
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const actualFilePath = `${this.workingDir}/${attachmentDir}/${record.FilePath}/${record.FileName}`;

      assert.ok(
        fs.existsSync(actualFilePath),
        `The file "${actualFilePath}" is not found`,
      );

      const actualContent = fs.readFileSync(actualFilePath, "utf8");
      assert.equal(
        actualContent,
        record.Content,
        `The content of the file "${actualFilePath}" does not matched.`,
      );
    }
  },
);

import * as assert from "assert";
import { Given, Then } from "../utils/world";
import fs from "fs";
import path from "path";
import iconv from "iconv-lite";

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

Then(
  "The output message should match the data in the order as below:",
  async function (table) {
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    let matchStr = "";
    records.forEach((record: string[]) => {
      const values = record
        .map((field: string) => (field ? `"${field}"` : ""))
        .join(",");
      matchStr += `${values}(.*)\n`;
    });
    const reg = new RegExp(matchStr);
    assert.match(
      this.response.stdout.toString(),
      reg,
      `The output message does not match the data in the order.\nExpected: \n${JSON.stringify(
        records,
      )}\nActual: \n${this.response.stdout}`,
    );
  },
);

Then(
  "The output message with table field should match the data below:",
  async function (table) {
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    records.forEach((record: string[]) => {
      const values = record
        .map((field: string) => {
          if (!field) {
            return "";
          }

          if (field === "*") {
            return `\\${field}`;
          }

          return `"${field}"`;
        })
        .join(",");
      assert.match(this.response.stdout.toString(), new RegExp(`${values}`));
    });
  },
);

Then(
  "The output message with {string} encoded should match with the data below:",
  async function (encoding, table) {
    const decodedOutputMsg = iconv.decode(this.response.stdout, encoding);
    const records = this.replacePlaceholdersInRawDataTables(table.raw());
    records.forEach((record: string[]) => {
      const values = record
        .map((field: string) => (field ? `"${field}"` : ""))
        .join(",");
      assert.match(decodedOutputMsg, new RegExp(`${values}`));
    });
  },
);

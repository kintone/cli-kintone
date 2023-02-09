import { ParserError } from "../../error";
import { parseCsv } from "../index";

describe("ParserError", () => {
  it("should throw error when the record number field code is not found", () => {
    const csvContent = `"Record_number_9999","Text"\n"1","sample1"`;
    const recordNumberFieldCode = "Record_number";

    return expect(() => parseCsv(csvContent, recordNumberFieldCode)).toThrow(
      new ParserError(
        `The record number field code (${recordNumberFieldCode}) is not found.`
      )
    );
  });
});

import { ParserError } from "../error";
import { CsvError } from "csv-parse";

describe("ParserError", () => {
  it("should be constructed with string cause", () => {
    const error = new ParserError("invalid format");
    expect(error.toString()).toBe("Failed to parse input\ninvalid format\n");
  });
  it("should be constructed with CsvError", () => {
    const csvError = new CsvError(
      "CSV_QUOTE_NOT_CLOSED",
      "Quote Not Closed: the parsing is finished with an opening quote at line 2"
    );
    const error = new ParserError(csvError);
    expect(error.toString()).toBe(
      "Failed to parse input\nCSV_QUOTE_NOT_CLOSED: Quote Not Closed: the parsing is finished with an opening quote at line 2\n"
    );
  });
});

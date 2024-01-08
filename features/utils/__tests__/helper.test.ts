import {
  compareBuffers,
  generateCsvRow,
  replacePlaceholders,
  validateRequireColumnsInTable,
} from "../helper";

describe("Helper functions", () => {
  describe("generateCsvRow", () => {
    it("should generate CSV row correctly", () => {
      const testPatterns = [
        {
          input: ["Record_number", "Text", "Number"],
          expected: '"Record_number","Text","Number"',
        },
        {
          input: ["1", "Alice", "10"],
          expected: '"1","Alice","10"',
        },
        {
          input: ["1", "Alice", ""],
          expected: '"1","Alice",',
        },
        {
          input: ["*", "1", "Alice", "10"],
          expected: '\\*,"1","Alice","10"',
        },
      ];

      testPatterns.forEach((testPattern) => {
        const actual = generateCsvRow(testPattern.input);
        expect(actual).toBe(testPattern.expected);
      });
    });
  });

  describe("replacePlaceholders", () => {
    it("should replace placeholders correctly", () => {
      const replacements = {
        STRING: "spacex",
        ARRAY_STRING: ["apple", "banana", "cherry"],
        NUMBER: 1,
        ARRAY_NUMBER: [10, 20, 30],
        BOOLEAN: false,
      };

      const testPatterns = [
        {
          replaceStr: "Placeholder: $STRING",
          expected: "Placeholder: spacex",
        },
        {
          replaceStr: "Placeholder: $ARRAY_STRING[1]",
          expected: "Placeholder: banana",
        },
        {
          replaceStr: "Placeholder: $NUMBER",
          expected: "Placeholder: 1",
        },
        {
          replaceStr: "Placeholder: $ARRAY_NUMBER[2]",
          expected: "Placeholder: 30",
        },
        {
          replaceStr: "Placeholder: $BOOLEAN",
          expected: "Placeholder: false",
        },
        {
          replaceStr: "Without placeholder: STRING",
          expected: "Without placeholder: STRING",
        },
      ];

      testPatterns.forEach((testPattern) => {
        const actual = replacePlaceholders(
          testPattern.replaceStr,
          replacements,
        );
        expect(actual).toBe(testPattern.expected);
      });
    });
  });

  describe("validateRequireColumnsInTable", () => {
    it("should throw error when required columns are not found", () => {
      const columns = ["FilePath"];
      const requiredColumns = ["FilePath", "FileName"];

      expect(() => {
        validateRequireColumnsInTable(columns, requiredColumns);
      }).toThrowError("The table should have FileName column");
    });
  });

  describe("compareBuffers", () => {
    it("should return TRUE if two buffers are the same", () => {
      const buffer1 = Buffer.from("This is the same buffer");
      const buffer2 = Buffer.from("This is the same buffer");

      expect(compareBuffers(buffer1, buffer2)).toBe(true);
    });

    it("should return FALSE if two buffers are different", () => {
      const buffer1 = Buffer.from("This is the first buffer");
      const buffer2 = Buffer.from("This is the second buffer");

      expect(compareBuffers(buffer1, buffer2)).toBe(false);
    });
  });
});

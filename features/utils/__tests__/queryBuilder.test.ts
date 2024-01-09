import { QueryBuilder } from "../queryBuilder";
import type { ImportArgs, ExportArgs, DeleteArgs } from "../subCommand";

describe("Query builder", () => {
  describe("Missing required parameters", () => {
    it("should throw error when missing command", async () => {
      expect(() => new QueryBuilder().getQuery()).toThrow(
        "The command is not initialized.",
      );
    });

    it("should throw error when missing subcommand", async () => {
      expect(() => new QueryBuilder({ command: "record" }).getQuery()).toThrow(
        "The sub command is not initialized.",
      );
    });

    it("should throw error when missing required argument", async () => {
      const args: ImportArgs = {
        baseUrl: "",
        app: "1",
        filePath: "test.csv",
      };

      expect(() => QueryBuilder.record().import(args).getQuery()).toThrow(
        'The "baseUrl" argument is required.',
      );
    });
  });

  describe("Valid parameters", () => {
    it("should return the import query correctly", async () => {
      const args: ImportArgs = {
        baseUrl: "https://example.com",
        app: "1",
        filePath: "test.csv",
        apiToken: "token",
        guestSpaceId: "2",
        attachmentsDir: "attachments",
        encoding: "utf8",
        updateKey: "Record_number",
        fields: ["field1", "field2"],
      };

      const query = QueryBuilder.record().import(args).getQuery();
      expect(query).toBe(
        "record import --base-url https://example.com --app 1 --file-path test.csv --api-token token --guest-space-id 2 --attachments-dir attachments --encoding utf8 --update-key Record_number --fields field1,field2",
      );
    });

    it("should return the export query correctly", async () => {
      const args: ExportArgs = {
        baseUrl: "https://example.com",
        app: "1",
        username: "user",
        password: "pass",
        apiToken: ["token1", "token2"],
        guestSpaceId: "2",
        attachmentsDir: "attachments",
        encoding: "utf8",
        fields: ["field1", "field2"],
        condition: "field1='value1'",
        orderBy: "field1 asc",
      };

      const query = QueryBuilder.record().export(args).getQuery();
      expect(query).toBe(
        'record export --base-url https://example.com --app 1 --username user --password pass --api-token token1,token2 --guest-space-id 2 --attachments-dir attachments --encoding utf8 --fields field1,field2 --condition "field1=\'value1\'" --order-by "field1 asc"',
      );
    });

    it("should return the delete query correctly", async () => {
      const args: DeleteArgs = {
        baseUrl: "https://example.com",
        app: "1",
        apiToken: ["token1", "token2"],
        guestSpaceId: "2",
        encoding: "utf8",
        filePath: "test.csv",
        yes: true,
      };

      const query = QueryBuilder.record().delete(args).getQuery();
      expect(query).toBe(
        "record delete --base-url https://example.com --app 1 --api-token token1,token2 --guest-space-id 2 --encoding utf8 --file-path test.csv --yes",
      );
    });
  });
});

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { printAsJson } from "./printAsJson";
import { printAsCsv } from "./printAsCsv";
import { KintoneRecord } from "../types/record";

export type ExportFileFormat = "csv" | "json";

export const printRecords: (options: {
  apiClient: KintoneRestAPIClient;
  records: KintoneRecord[];
  app: string;
  format?: ExportFileFormat;
  attachmentsDir?: string;
}) => void = async (options) => {
  const { apiClient, records, app, format, attachmentsDir } = options;
  switch (format) {
    case "json": {
      printAsJson(records);
      break;
    }
    case "csv": {
      // TODO: pass the schema as arguments
      printAsCsv({
        records,
        fieldsJson: await apiClient.app.getFormFields({ app }),
        attachmentsDir,
      });
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
};

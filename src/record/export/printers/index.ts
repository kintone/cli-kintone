import type { KintoneRecord } from "../types/record";

import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { printAsJson } from "./printAsJson";
import { printAsCsv } from "./printAsCsv";

export type ExportFileFormat = "csv" | "json";

export const printRecords: (options: {
  apiClient: KintoneRestAPIClient;
  records: KintoneRecord[];
  app: string;
  format?: ExportFileFormat;
  useLocalFilePath: boolean;
}) => void = async (options) => {
  const { apiClient, records, app, format, useLocalFilePath } = options;
  switch (format) {
    case "json": {
      printAsJson(records);
      break;
    }
    case "csv": {
      printAsCsv(
        records,
        await apiClient.app.getFormFields({ app }),
        await apiClient.app.getFormLayout({ app }),
        useLocalFilePath
      );
      break;
    }
    default: {
      throw new Error(
        `Unknown format type. '${format}' is unknown as a format option.`
      );
    }
  }
};

import iconv from "iconv-lite";

import { buildRestAPIClient, RestAPIClientOptions } from "../../kintone/client";
import { getRecords } from "./usecases/get";
import { ExportFileFormat, stringifierFactory } from "./stringifiers";
import { createSchema } from "./schema";
import { formLayout as defaultTransformer } from "./schema/transformers/formLayout";
import { userSelected } from "./schema/transformers/userSelected";

export type ExportFileEncoding = "utf8" | "sjis";

export type Options = {
  app: string;
  attachmentsDir?: string;
  format: ExportFileFormat;
  encoding: ExportFileEncoding;
  condition?: string;
  orderBy?: string;
  fields?: string[];
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (options) => {
  validateOptions(options);
  const {
    app,
    format,
    encoding,
    condition,
    orderBy,
    fields,
    attachmentsDir,
    ...restApiClientOptions
  } = options;
  const apiClient = buildRestAPIClient(restApiClientOptions);
  const fieldsJson = await apiClient.app.getFormFields({ app });
  const schema = createSchema(
    fieldsJson,
    fields
      ? userSelected(fields, fieldsJson)
      : defaultTransformer(await apiClient.app.getFormLayout({ app }))
  );
  const records = await getRecords(apiClient, app, schema, {
    condition,
    orderBy,
    attachmentsDir,
  });
  const stringifier = stringifierFactory({
    format,
    schema,
    useLocalFilePath: !!attachmentsDir,
  });
  const stringifiedRecords = stringifier(records);
  process.stdout.write(iconv.encode(stringifiedRecords, encoding));
};

const validateOptions = (options: Options): void => {
  if (options.format === "json" && options.encoding !== "utf8") {
    throw new Error(
      "When the output format is JSON, the encoding MUST be UTF-8"
    );
  }
};

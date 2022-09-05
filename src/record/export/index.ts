import iconv from "iconv-lite";

import { buildRestAPIClient, RestAPIClientOptions } from "../../kintone/client";
import { getRecords } from "./usecases/get";
import { stringifierFactory } from "./stringifiers";
import { createSchema } from "./schema";
import { formLayout as defaultTransformer } from "./schema/transformers/formLayout";
import { userSelected } from "./schema/transformers/userSelected";

export type ExportFileEncoding = "utf8" | "sjis";

export type Options = {
  app: string;
  attachmentsDir?: string;
  encoding: ExportFileEncoding;
  condition?: string;
  orderBy?: string;
  fields?: string[];
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (options) => {
  const {
    app,
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
    format: "csv",
    schema,
    useLocalFilePath: !!attachmentsDir,
  });
  const stringifiedRecords = stringifier(records);
  process.stdout.write(iconv.encode(stringifiedRecords, encoding));
};

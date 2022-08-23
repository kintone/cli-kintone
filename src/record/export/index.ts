import { buildRestAPIClient, RestAPIClientOptions } from "../../kintone/client";
import { getRecords } from "./usecases/get";
import { ExportFileFormat, printRecords } from "./printers";
import { createSchema } from "./schema";
import { formLayout as defaultTransformer } from "./schema/transformers/formLayout";
import { userSelected } from "./schema/transformers/userSelected";

export type Options = {
  app: string;
  attachmentsDir?: string;
  format?: ExportFileFormat;
  condition?: string;
  orderBy?: string;
  fields?: string[];
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (argv) => {
  const {
    app,
    format,
    condition,
    orderBy,
    fields,
    attachmentsDir,
    ...restApiClientOptions
  } = argv;
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
  await printRecords({
    records,
    format,
    schema,
    useLocalFilePath: !!attachmentsDir,
  });
};

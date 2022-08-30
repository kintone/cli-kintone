import { buildRestAPIClient, RestAPIClientOptions } from "../../kintone/client";
import { SupportedImportEncoding, readFile } from "./utils/file";
import { parseRecords } from "./parsers";
import { addRecords } from "./usecases/add";
import { upsertRecords } from "./usecases/upsert";
import { createSchema } from "./schema";
import { noop as defaultTransformer } from "./schema/transformers/noop";
import { userSelected } from "./schema/transformers/userSelected";

export type Options = {
  app: string;
  filePath: string;
  attachmentsDir?: string;
  updateKey?: string;
  encoding?: SupportedImportEncoding;
  fields?: string[];
};

export const run: (
  argv: RestAPIClientOptions & Options
) => Promise<void> = async (argv) => {
  const {
    app,
    filePath,
    encoding,
    attachmentsDir,
    updateKey,
    fields,
    ...restApiClientOptions
  } = argv;

  const apiClient = buildRestAPIClient(restApiClientOptions);

  try {
    const fieldsJson = await apiClient.app.getFormFields({ app });
    const schema = createSchema(
      fieldsJson,
      fields
        ? userSelected(fields, fieldsJson, updateKey)
        : defaultTransformer()
    );
    const { content, format } = await readFile(filePath, encoding);
    const records = await parseRecords({
      source: content,
      format,
      schema,
    });
    const skipMissingFields = !fields;
    if (updateKey) {
      await upsertRecords(apiClient, app, records, schema, updateKey, {
        attachmentsDir,
        skipMissingFields,
      });
    } else {
      await addRecords(apiClient, app, records, schema, {
        attachmentsDir,
        skipMissingFields,
      });
    }
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

import { buildRestAPIClient, RestAPIClientOptions } from "../../kintone/client";
import { SupportedImportEncoding, readFile } from "./utils/file";
import { parseRecords } from "./parsers";
import { addRecords } from "./usecases/add";
import { upsertRecords } from "./usecases/upsert";
import { createSchema } from "./schema";
import { noop as defaultTransformer } from "./schema/transformers/noop";

export type Options = {
  app: string;
  filePath: string;
  attachmentsDir?: string;
  updateKey?: string;
  encoding?: SupportedImportEncoding;
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
    ...restApiClientOptions
  } = argv;

  const apiClient = buildRestAPIClient(restApiClientOptions);

  try {
    const schema = createSchema(
      await apiClient.app.getFormFields({ app }),
      defaultTransformer()
    );
    const { content, format } = await readFile(filePath, encoding);
    const records = await parseRecords({
      source: content,
      format,
      schema,
    });
    if (updateKey) {
      await upsertRecords(apiClient, app, records, schema, updateKey, {
        attachmentsDir,
      });
    } else {
      await addRecords(apiClient, app, records, schema, { attachmentsDir });
    }
  } catch (e) {
    console.log(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

import type { RestAPIClientOptions } from "../../kintone/client";
import { buildRestAPIClient } from "../../kintone/client";
import type { SupportedImportEncoding } from "./utils/file";
import { openFsStreamWithEncode } from "./utils/file";
import { addRecords } from "./usecases/add";
import { upsertRecords } from "./usecases/upsert";
import { createSchema } from "./schema";
import { noop as defaultTransformer } from "./schema/transformers/noop";
import { userSelected } from "./schema/transformers/userSelected";
import { logger } from "../../utils/log";
import { LocalRecordRepositoryFromStream } from "./repositories/localRecordRepositoryFromStream";

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
  try {
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

    const fieldsJson = await apiClient.app.getFormFields({ app });
    const schema = createSchema(
      fieldsJson,
      fields
        ? userSelected(fields, fieldsJson, updateKey)
        : defaultTransformer()
    );
    const { format } = openFsStreamWithEncode(filePath, encoding);
    const localRecordRepository = new LocalRecordRepositoryFromStream(
      () => openFsStreamWithEncode(filePath, encoding).stream,
      format,
      schema
    );

    if ((await localRecordRepository.length()) === 0) {
      logger.warn("The input file does not have any records");
      return;
    }

    const skipMissingFields = !fields;
    if (updateKey) {
      await upsertRecords(apiClient, app, [], schema, updateKey, {
        attachmentsDir,
        skipMissingFields,
      });
    } else {
      await addRecords(apiClient, app, localRecordRepository, schema, {
        attachmentsDir,
        skipMissingFields,
      });
    }
  } catch (e) {
    logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

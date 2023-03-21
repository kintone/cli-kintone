import type { RestAPIClientOptions } from "../../kintone/client.js";
import { buildRestAPIClient } from "../../kintone/client.js";
import type { SupportedImportEncoding } from "../../utils/file.js";
import { extractFileFormat, openFsStreamWithEncode } from "../../utils/file.js";
import { addRecords } from "./usecases/add.js";
import { upsertRecords } from "./usecases/upsert.js";
import { createSchema } from "./schema/index.js";
import { noop as defaultTransformer } from "./schema/transformers/noop.js";
import { userSelected } from "./schema/transformers/userSelected.js";
import { logger } from "../../utils/log.js";
import { LocalRecordRepositoryFromStream } from "./repositories/localRecordRepositoryFromStream.js";

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
    const format = extractFileFormat(filePath);
    const localRecordRepository = new LocalRecordRepositoryFromStream(
      () => openFsStreamWithEncode(filePath, encoding),
      format,
      schema
    );

    if ((await localRecordRepository.length()) === 0) {
      logger.warn("The input file does not have any records");
      return;
    }

    const skipMissingFields = !fields;
    if (updateKey) {
      await upsertRecords(
        apiClient,
        app,
        localRecordRepository,
        schema,
        updateKey,
        {
          attachmentsDir,
          skipMissingFields,
        }
      );
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

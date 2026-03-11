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
import { RunError } from "../error/index.js";
import { isMismatchEncoding } from "../../utils/encoding.js";
import { emitDeprecationWarning } from "../../utils/stability.js";

export type Options = {
  app: string;
  filePath: string;
  attachmentsDir?: string;
  updateKey?: string;
  encoding?: SupportedImportEncoding;
  fields?: string[];
  useServerSideUpsert?: boolean;
};

export const run: (
  argv: RestAPIClientOptions & Options,
) => Promise<void> = async (argv) => {
  try {
    const {
      app,
      filePath,
      encoding,
      attachmentsDir,
      updateKey,
      fields,
      useServerSideUpsert,
      ...restApiClientOptions
    } = argv;

    if (encoding) {
      await validateEncoding(filePath, encoding);
    }
    const apiClient = buildRestAPIClient(restApiClientOptions);
    const fieldsJson = await apiClient.app.getFormFields({ app });
    const schema = createSchema(
      fieldsJson,
      fields
        ? userSelected(fields, fieldsJson, updateKey)
        : defaultTransformer(),
    );
    const format = extractFileFormat(filePath);
    const localRecordRepository = new LocalRecordRepositoryFromStream(
      () => openFsStreamWithEncode(filePath, encoding),
      format,
      schema,
    );

    if ((await localRecordRepository.length()) === 0) {
      logger.warn("The input file does not have any records");
      return;
    }

    const skipMissingFields = !fields;
    if (updateKey) {
      if (useServerSideUpsert) {
        emitDeprecationWarning(
          "Server-side upsert is now the default behavior. This flag is no longer needed and will be removed in a future version.",
          logger,
        );
      }
      await upsertRecords(
        apiClient,
        app,
        localRecordRepository,
        schema,
        updateKey,
        {
          attachmentsDir,
          skipMissingFields,
        },
      );
    } else {
      await addRecords(apiClient, app, localRecordRepository, schema, {
        attachmentsDir,
        skipMissingFields,
      });
    }
  } catch (e) {
    logger.error(new RunError(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

const validateEncoding: (
  filePath: string,
  encoding: SupportedImportEncoding,
) => Promise<void> = async (filePath, encoding) => {
  if (await isMismatchEncoding(filePath, encoding)) {
    throw new Error(
      `Failed to decode the specified CSV file.\nThe specified encoding (${encoding}) might mismatch the actual encoding of the CSV file.`,
    );
  }
};

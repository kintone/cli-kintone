import type { RestAPIClientOptions } from "../../kintone/client";
import { buildRestAPIClient } from "../../kintone/client";
import type { SupportedImportEncoding } from "../../utils/file";
import { extractFileFormat, openFsStreamWithEncode } from "../../utils/file";
import { addRecords } from "./usecases/add";
import { upsertRecords } from "./usecases/upsert";
import { upsertRecords as upsertRecordsServerSide } from "./usecases/upsertServerSide";
import { createSchema } from "./schema";
import { noop as defaultTransformer } from "./schema/transformers/noop";
import { userSelected } from "./schema/transformers/userSelected";
import { logger } from "../../utils/log";
import { LocalRecordRepositoryFromStream } from "./repositories/localRecordRepositoryFromStream";
import { RunError } from "../error";
import { isMismatchEncoding } from "../../utils/encoding";
import { emitExperimentalWarning } from "../../utils/stability";

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
        emitExperimentalWarning(
          "Use server-side upsert. This option is under early development.",
          logger,
        );
        await upsertRecordsServerSide(
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
      }
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

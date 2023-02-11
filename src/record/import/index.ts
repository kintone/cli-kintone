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
import fs from "fs";

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
    fs.writeFileSync(
      "stats.csv",
      "timestamp,rss,heapTotal,heapUsed,external,arrayBuffers,label\n"
    );

    logger.info("Init");

    const {
      app,
      filePath,
      encoding,
      attachmentsDir,
      updateKey,
      fields,
      ...restApiClientOptions
    } = argv;

    logger.info("Before apiClient");

    const apiClient = buildRestAPIClient(restApiClientOptions);

    logger.info("After apiClient");

    const fieldsJson = await apiClient.app.getFormFields({ app });
    const schema = createSchema(
      fieldsJson,
      fields
        ? userSelected(fields, fieldsJson, updateKey)
        : defaultTransformer()
    );
    if (global.gc) {
      global.gc();
    }
    logger.info("After createSchema");

    // const { format } = openFsStreamWithEncode(filePath, encoding);
    const localRecordRepository = new LocalRecordRepositoryFromStream(
      () => openFsStreamWithEncode(filePath, encoding).stream,
      "csv",
      schema
    );
    logger.info("After new LocalRecordRepositoryFromStream");

    if ((await localRecordRepository.length()) === 0) {
      logger.warn("The input file does not have any records");
      return;
    }
    logger.info("After localRecordRepository.length()");

    const skipMissingFields = !fields;
    if (updateKey) {
      logger.info("Before upsertRecords");

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
      if (global.gc) {
        global.gc();
      }
      logger.info("After upsertRecords");
    } else {
      logger.info("Before addRecords");

      await addRecords(apiClient, app, localRecordRepository, schema, {
        attachmentsDir,
        skipMissingFields,
      });
      if (global.gc) {
        global.gc();
      }
      logger.info("After addRecords");
    }
  } catch (e) {
    logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

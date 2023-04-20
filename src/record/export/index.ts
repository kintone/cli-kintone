import iconv from "iconv-lite";

import type { RestAPIClientOptions } from "../../kintone/client";
import { buildRestAPIClient } from "../../kintone/client";
import { getRecords, getRecordsGenerator } from "./usecases/get";
import { stringifierFactory } from "./stringifiers";
import { createSchema } from "./schema";
import { formLayout as defaultTransformer } from "./schema/transformers/formLayout";
import { userSelected } from "./schema/transformers/userSelected";
import { logger } from "../../utils/log";

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
  try {
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
    const layoutJson = await apiClient.app.getFormLayout({ app });
    const schema = createSchema(
      fieldsJson,
      fields
        ? userSelected(fields, fieldsJson, layoutJson)
        : defaultTransformer(layoutJson)
    );
    // const records = await getRecords(apiClient, app, schema, {
    //   condition,
    //   orderBy,
    //   attachmentsDir,
    // });
    const stringifier = stringifierFactory({
      format: "csv",
      schema,
      useLocalFilePath: !!attachmentsDir,
    });
    // const stringifiedRecords = stringifier(records);
    // process.stdout.write(iconv.encode(stringifiedRecords, encoding));

    for await (const records of getRecordsGenerator(apiClient, app, schema, {
      condition,
      orderBy,
      attachmentsDir,
    })) {
      const stringifiedRecords = await stringifier.stringify(records);
      process.stdout.write(iconv.encode(stringifiedRecords, encoding));
      //   repository.write(records);
    }
  } catch (e) {
    logger.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
};

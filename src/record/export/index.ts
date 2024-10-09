import iconv from "iconv-lite";

import type { RestAPIClientOptions } from "../../kintone/client";
import { buildRestAPIClient } from "../../kintone/client";
import { getRecords } from "./usecases/get";
import { createSchema } from "./schema";
import { formLayout as defaultTransformer } from "./schema/transformers/formLayout";
import { userSelected } from "./schema/transformers/userSelected";
import { logger } from "../../utils/log";
import { LocalRecordRepositoryFromStream } from "./repositories/localRecordRepositoryFromStream";
import { Transform } from "stream";
import { RunError } from "../error";

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
  argv: RestAPIClientOptions & Options,
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
        : defaultTransformer(layoutJson),
    );

    const repository = new LocalRecordRepositoryFromStream(
      () => {
        const encodeStream = Transform.from(iconv.encodeStream(encoding));
        encodeStream.pipe(process.stdout);
        return encodeStream;
      },
      schema,
      !!attachmentsDir,
    );

    await getRecords(apiClient, app, repository, schema, {
      condition,
      orderBy,
      attachmentsDir,
    });
  } catch (e) {
    logger.error(new RunError(e));
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

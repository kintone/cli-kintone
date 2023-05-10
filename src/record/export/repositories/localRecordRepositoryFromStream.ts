import type { LocalRecordRepository } from "../usecases/interface";
import type { RecordSchema } from "../types/schema";
import { stringifierFactory } from "./stringifiers";

export class LocalRecordRepositoryFromStream implements LocalRecordRepository {
  readonly format = "csv";

  private readonly openWritableSink: () => NodeJS.WritableStream;
  private readonly schema: RecordSchema;
  private readonly useLocalFilePath: boolean;

  constructor(
    openWritableSink: () => NodeJS.WritableStream,
    schema: RecordSchema,
    useLocalFilePath: boolean
  ) {
    this.openWritableSink = openWritableSink;
    this.schema = schema;
    this.useLocalFilePath = useLocalFilePath;
  }
  writer() {
    const stringifier = stringifierFactory({
      format: this.format,
      schema: this.schema,
      useLocalFilePath: this.useLocalFilePath,
    });
    stringifier.pipe(this.openWritableSink());
    return stringifier;
  }
}

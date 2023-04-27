import type { LocalRecordRepository } from "../usecases/interface";
import type { RecordSchema } from "../types/schema";
import { stringifierFactory } from "./stringifiers";

export class LocalRecordRepositoryFromStream implements LocalRecordRepository {
  readonly format = "csv";

  private readonly destination: () => NodeJS.WritableStream;
  private readonly schema: RecordSchema;
  private readonly useLocalFilePath: boolean;

  constructor(
    destination: () => NodeJS.WritableStream,
    schema: RecordSchema,
    useLocalFilePath: boolean
  ) {
    this.destination = destination;
    this.schema = schema;
    this.useLocalFilePath = useLocalFilePath;
  }
  writer() {
    const stringifier = stringifierFactory({
      format: this.format,
      schema: this.schema,
      useLocalFilePath: this.useLocalFilePath,
    });
    stringifier.pipe(this.destination());
    return stringifier;
  }
}

import type { LocalRecordRepository } from "../usecases/interface";
import type { LocalRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";
import { stringifierFactory } from "./stringifiers";

export class LocalRecordRepositoryFromStream implements LocalRecordRepository {
  private readonly destination: () => NodeJS.WritableStream;
  readonly format = "csv";
  readonly schema: RecordSchema;
  readonly useLocalFilePath: boolean;

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
    const dest = this.destination();
    const stringifier = stringifierFactory({
      format: this.format,
      schema: this.schema,
      useLocalFilePath: this.useLocalFilePath,
    });
    return {
      write: async (input: LocalRecord[]) => {
        const recordsString = await stringifier.stringify(input);
        dest.write(recordsString);
      },
    };
  }
}

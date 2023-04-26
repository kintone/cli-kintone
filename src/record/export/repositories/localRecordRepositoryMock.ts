import type { LocalRecordRepository } from "../usecases/interface";
import type { LocalRecord } from "../types/record";
import type { RecordSchema } from "../types/schema";
import { stringifierFactory } from "./stringifiers";

export class LocalRecordRepositoryMock implements LocalRecordRepository {
  destination: string = "";
  receivedRecords: LocalRecord[] = [];

  readonly format = "csv";
  readonly schema: RecordSchema;
  readonly useLocalFilePath: boolean;

  constructor(schema: RecordSchema, useLocalFilePath: boolean) {
    this.schema = schema;
    this.useLocalFilePath = useLocalFilePath;
  }
  writer() {
    const stringifier = stringifierFactory({
      format: this.format,
      schema: this.schema,
      useLocalFilePath: this.useLocalFilePath,
    });
    return {
      write: async (input: LocalRecord[]) => {
        this.receivedRecords.push(...input);
        const recordsString = await stringifier.stringify(input);
        this.destination += recordsString;
      },
    };
  }
}

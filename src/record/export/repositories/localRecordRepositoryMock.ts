import type { LocalRecordRepository } from "../usecases/interface";
import type { LocalRecord } from "../types/record";
import { Writable } from "stream";

export class LocalRecordRepositoryMock implements LocalRecordRepository {
  private underlyingSink: WritableMock = new WritableMock();

  readonly format = "csv";

  writer() {
    this.underlyingSink = new WritableMock();
    return this.underlyingSink;
  }
  receivedRecords() {
    return this.underlyingSink.underlyingSink;
  }
}

class WritableMock extends Writable {
  public underlyingSink: LocalRecord[] = [];
  constructor() {
    super({ objectMode: true });
  }
  _write(chunk: LocalRecord[]) {
    this.underlyingSink.push(...chunk);
  }
}

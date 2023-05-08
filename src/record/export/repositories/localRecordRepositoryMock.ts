import type { LocalRecordRepository, Writer } from "../usecases/interface";
import type { LocalRecord } from "../types/record";

export class LocalRecordRepositoryMock implements LocalRecordRepository {
  readonly format = "csv";

  private underlyingSink: WritableMock = new WritableMock();

  writer() {
    this.underlyingSink = new WritableMock();
    return this.underlyingSink;
  }
  receivedRecords() {
    return this.underlyingSink.underlyingSink;
  }
}

class WritableMock implements Writer {
  public underlyingSink: LocalRecord[] = [];
  async write(chunk: LocalRecord[]) {
    this.underlyingSink.push(...chunk);
  }
  async end() {
    /* noop */
  }
}

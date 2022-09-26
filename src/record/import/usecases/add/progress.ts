import { logger } from "../../utils/log";

export class ProgressLogger {
  private readonly length: number;
  private readonly interval: number;
  private next: number;
  private last: number = -1;

  constructor(length: number, interval: number = 1000) {
    this.length = length;
    this.interval = interval;
    this.next = this.interval;
  }

  start() {
    printProgress(0, this.length);
  }

  update(succeededCount: number) {
    while (succeededCount >= this.next) {
      printProgress(this.next, this.length);
      this.last = this.next;
      this.next += this.interval;
    }
  }

  abort(succeededCount: number) {
    if (succeededCount > 0 && succeededCount !== this.last) {
      printProgress(succeededCount, this.length);
    }
  }

  done() {
    if (this.last !== this.length) {
      printProgress(this.length, this.length);
    }
  }
}

const printProgress = (current: number, length: number): void => {
  logger.info(`Succeeded to import ${current}/${length} records`);
};

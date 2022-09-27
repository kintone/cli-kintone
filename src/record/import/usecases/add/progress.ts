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
    logger.info(
      `Imported ${succeededCount} of ${this.length} records successfully`
    );
  }

  done() {
    logger.info(`Imported ${this.length} records successfully`);
  }
}

const printProgress = (current: number, length: number): void => {
  logger.info(`Imported ${current} of ${length} records`);
};

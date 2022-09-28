import type { Logger } from "../../utils/log";

export class ProgressLogger {
  private readonly logger: Logger;

  private readonly length: number;
  private readonly interval: number;
  private next: number;
  private last: number = -1;

  constructor(logger: Logger, length: number, interval: number = 1000) {
    this.logger = logger;
    this.length = length;
    this.interval = interval;
    this.next = this.interval;
  }

  start() {
    printProgress(this.logger, 0, this.length);
  }

  update(succeededCount: number) {
    while (succeededCount >= this.next) {
      printProgress(this.logger, this.next, this.length);
      this.last = this.next;
      this.next += this.interval;
    }
  }

  abort(succeededCount: number) {
    this.logger.info(
      `Imported ${succeededCount} of ${this.length} records successfully`
    );
  }

  done() {
    this.logger.info(`Imported ${this.length} records successfully`);
  }
}

const printProgress = (
  logger: Logger,
  current: number,
  length: number
): void => {
  logger.info(`Imported ${current} of ${length} records`);
};

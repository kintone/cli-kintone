import { logger } from "../../utils/log";

export class ProgressLogger {
  private readonly length: number;
  private readonly interval: number;
  private nextInterval: number;

  constructor(length: number, interval: number = 1000) {
    this.length = length;
    this.interval = interval;
    this.nextInterval = 0;
  }

  update(current: number) {
    while (current >= this.nextInterval) {
      printProgress(this.nextInterval, this.length);
      this.nextInterval += this.interval;
    }
  }
}

const printProgress = (current: number, length: number): void => {
  logger.info(`Success to import ${current}/${length} records`);
};

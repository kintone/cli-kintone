import { retry } from "../retry";

describe("retry", () => {
  it("should return result when given function is resolved", async () => {
    const maxAttempt = 5;
    const initialDelay = 100;
    const maxDelay = 500;
    const maxJitter = 10;

    const promise = retry(
      () => {
        return true;
      },
      () => {
        /* noop */
      },
      maxAttempt,
      initialDelay,
      maxDelay,
      maxJitter,
    );
    await expect(promise).resolves.toBe(true);
  });

  it("should throw an error when all retries are failed", async () => {
    const maxAttempt = 5;
    const initialDelay = 100;
    const maxDelay = 500;
    const maxJitter = 10;

    const promise = retry(
      () => {
        throw new Error(`Error`);
      },
      () => {
        /* noop */
      },
      maxAttempt,
      initialDelay,
      maxDelay,
      maxJitter,
    );
    await expect(promise).rejects.toThrow(new Error(`Error`));
  });

  it(
    "should repeat given function after delay on error and return result on resolve",
    async () => {
      const maxAttempt = 10;
      const initialDelay = 100;
      const maxDelay = 500;
      const maxJitter = 10;

      const expectedNextDelays = [
        { min: 100, max: 110 },
        { min: 200, max: 210 },
        { min: 400, max: 410 },
        { min: 500, max: 510 },
        { min: 500, max: 510 },
      ];
      let count = 1;
      const result = await retry(
        () => {
          if (count === 6) {
            return true;
          }
          throw new Error(`Error: ${count}`);
        },
        (_, __, nextDelay) => {
          expect(nextDelay).toBeGreaterThanOrEqual(
            expectedNextDelays[count - 1].min,
          );
          expect(nextDelay).toBeLessThan(expectedNextDelays[count - 1].max);
          count++;
        },
        maxAttempt,
        initialDelay,
        maxDelay,
        maxJitter,
      );
      expect(result).toBe(true);
    },
    5 * 1000,
  );
});

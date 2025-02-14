import { retry } from "../retry";

// Mock setTimeout because we don't need to really wait.
jest.mock("timers/promises", () => ({
  setTimeout: () => {
    /* noop */
  },
}));

describe("retry", () => {
  describe("input sync function", () => {
    it("should return result when given function is resolved", async () => {
      const promise = retry(() => {
        return true;
      });
      await expect(promise).resolves.toBe(true);
    });

    it("should throw an error when all retries are failed", async () => {
      const promise = retry(() => {
        throw new Error(`Error`);
      });
      await expect(promise).rejects.toThrow(new Error(`Error`));
    });

    it("should throw an error when retry conditions are not match", async () => {
      let count = 0;
      const promise = retry(
        () => {
          throw new Error(`Error: ${count}`);
        },
        {
          onError: () => {
            count++;
          },
          retryCondition: (e) => e instanceof Error && e.message !== "Error: 3",
        },
      );
      await expect(promise).rejects.toThrow(new Error(`Error: 3`));
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
          {
            onError: (_, __, ___, nextDelay) => {
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
          },
        );
        expect(result).toBe(true);
      },
      5 * 1000,
    );
  });

  describe("input async function", () => {
    it("should return result when given function is resolved", async () => {
      const promise = retry(async () => {
        return true;
      });
      await expect(promise).resolves.toBe(true);
    });

    it("should throw an error when all retries are failed", async () => {
      const promise = retry(async () => {
        throw new Error(`Error`);
      });
      await expect(promise).rejects.toThrow(new Error(`Error`));
    });

    it("should throw an error when retry conditions are not match", async () => {
      let count = 0;
      const promise = retry(
        async () => {
          throw new Error(`Error: ${count}`);
        },
        {
          onError: () => {
            count++;
          },
          retryCondition: (e) => e instanceof Error && e.message !== "Error: 3",
        },
      );
      await expect(promise).rejects.toThrow(new Error(`Error: 3`));
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
          async () => {
            if (count === 6) {
              return true;
            }
            throw new Error(`Error: ${count}`);
          },
          {
            onError: (_, __, ___, nextDelay) => {
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
          },
        );
        expect(result).toBe(true);
      },
      5 * 1000,
    );
  });
});

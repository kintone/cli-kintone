import { setTimeout } from "timers/promises";

/**
 * Retry given function with exponential backoff with jitter strategy
 * Delay time before retry increases exponentially until it reaches maxDelay
 * @param fn function to run
 * @param onError callback function on rejection on each attempt
 * @param maxAttempt max attempt count
 * @param initialDelay initial delay time before retry (milliseconds)
 * @param maxDelay maximum delay time before retry (milliseconds) (The maxDelay is inclusive)
 * @param maxJitter maximum jitter (milliseconds) (The maxJitter is exclusive)
 */
export const retry = async <T>(
  fn: () => Promise<T> | T,
  onError?: (
    e: unknown,
    attemptCount: number,
    nextDelay: number,
  ) => void | Promise<void>,
  maxAttempt: number = 5,
  initialDelay: number = 1000,
  maxDelay: number = 60 * 1000,
  maxJitter: number = 1000,
): Promise<T> => {
  let finalError: unknown;
  for (
    let attemptCount = 1, delay = 0;
    attemptCount < maxAttempt;
    attemptCount++
  ) {
    await setTimeout(delay);
    try {
      return fn();
    } catch (e) {
      const jitter = Math.floor(Math.random() * maxJitter);
      delay =
        Math.min(initialDelay * 2 ** (attemptCount - 1), maxDelay) + jitter;
      finalError = e;
      if (typeof onError === "function") {
        await onError(e, attemptCount, delay);
      }
    }
  }
  throw finalError;
};

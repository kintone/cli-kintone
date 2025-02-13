import { setTimeout } from "timers/promises";

/**
 * Retry given function with exponential backoff with jitter strategy.
 * Delay time before retry increases exponentially until it reaches maxDelay.
 * @param fn A function to run.
 * @param options Options.
 * @param options.onError Callback function on rejection on each attempt.
 * @param options.retryCondition Condition function for whether to retry.
 * @param options.maxAttempt Max attempt count. Default to 5.
 * @param options.initialDelay Initial delay milliseconds before retry. Default to 1000ms.
 * @param options.maxDelay Maximum delay milliseconds before retry. Default to 60,000ms. The maxDelay value is inclusive.
 * @param options.maxJitter Maximum jitter milliseconds. Default to 1000ms. The maxJitter value is exclusive.
 */
export const retry = async <T>(
  fn: () => Promise<T> | T,
  options?: {
    onError?: (
      e: unknown,
      attemptCount: number,
      toRetry: boolean,
      nextDelay: number,
    ) => void | Promise<void>;
    retryCondition?: (error: unknown) => boolean;
    maxAttempt?: number;
    initialDelay?: number;
    maxDelay?: number;
    maxJitter?: number;
  },
): Promise<T> => {
  const onError =
    options?.onError ??
    (() => {
      /* noop */
    });
  const retryCondition = options?.retryCondition ?? defaultRetryCondition;
  const maxAttempt = options?.maxAttempt ?? 5;
  const initialDelay = options?.initialDelay ?? 1000;
  const maxDelay = options?.maxDelay ?? 60 * 1000;
  const maxJitter = options?.maxJitter ?? 1000;

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
      finalError = e;

      // Plan next retry
      const retryCond = retryCondition(e);
      const jitter = Math.floor(Math.random() * maxJitter);
      delay =
        Math.min(initialDelay * 2 ** (attemptCount - 1), maxDelay) + jitter;

      await onError(e, attemptCount, retryCond, delay);

      // Throw immediately if retry conditions are not met
      if (!retryCond) {
        throw e;
      }
    }
  }
  throw finalError;
};

const defaultRetryCondition = (_e: unknown) => true;

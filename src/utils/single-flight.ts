/**
 * Coalesces concurrent invocations of an async operation into a single
 * in-flight promise. Every caller that arrives while the operation is
 * running receives the same promise (and result); once settled, the next
 * call starts a fresh operation.
 */
export const createSingleFlight = <T>(
  operation: () => Promise<T>
): (() => Promise<T>) => {
  let inFlight: Promise<T> | null = null;

  return () => {
    if (inFlight) {
      return inFlight;
    }

    inFlight = operation().finally(() => {
      inFlight = null;
    });

    return inFlight;
  };
};

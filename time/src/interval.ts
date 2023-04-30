/**
 * Generic time interval.
 *
 * @example
 *
 * ```ts
 *   type DateInterval = Interval<Date>;
 *   ```;
 * ```
 */
export type Interval<T> = {
  end: T;
  start: T;
};

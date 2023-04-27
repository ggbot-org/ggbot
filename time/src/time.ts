import {
  NaturalNumber,
  isNaturalNumber,
  objectTypeGuard,
} from "@ggbot2/type-utils";
import { Interval } from "./interval.js";

/**
 * Epoch time.
 *
 * The number of milliseconds since the
 *
 * @link{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps|ECMAScript epoch}.
 */
export type Time = NaturalNumber;

export const isTime = (arg: unknown): arg is Time => isNaturalNumber(arg);

export const now = (): Time => new Date().getTime();

export type TimeInterval = Interval<Time>;
export const isTimeInterval = objectTypeGuard<TimeInterval>(
  ({ start, end }) => isTime(start) && isTime(end) && start <= end
);

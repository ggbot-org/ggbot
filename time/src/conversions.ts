import { ErrorInvalidDate } from "./errors.js";
import type { Day } from "./day.js";
import type { ValidDateArg } from "./date.js";
import type { Time } from "./time.js";
import type { Timestamp } from "./timestamp.js";

/** Convert `Date` to `Day`.
@throws {ErrorInvalidDate}
*/
export const getDayFromDate = (date: Date): Day => {
  // Notice that invalid dates could return a null JSON
  //
  //     new Date('0000-00-00').toJSON() // null
  const dateString = date.toJSON();
  if (!dateString) throw new ErrorInvalidDate();
  return dateString.substring(0, 10);
};

/** Convert `Timestamp` to `Day`. */
export const getDayFromTimestamp = (timestamp: Timestamp): Day => {
  return timestamp.substring(0, 10);
};

/** Convert `Timestamp` to `Time`. */
export const getTimeFromTimestamp = (timestamp: Timestamp): Time => {
  return new Date(timestamp).getTime();
};

/** Convert `Date` to `Timestamp`.
@throws {ErrorInvalidDate}
*/
export const getTimestampFromDate = (date: Date): Timestamp => {
  const timestamp = date.toJSON();
  if (timestamp === null) throw new ErrorInvalidDate(date);
  return timestamp;
};

/** Convert `ValidDateArg` to `Timestamp`. */
export const getTimestampFromValidDateArg = (date: ValidDateArg): Timestamp => {
  const timestamp = new Date(date).toJSON();
  return timestamp;
};

/** Convert `Day` to `Timestamp`. */
export const getTimestampFromDay = (day: Day): Timestamp => {
  return new Date(day).toJSON();
};

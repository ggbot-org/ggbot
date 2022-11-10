import { ErrorInvalidDate } from "./errors.js";
import { Day, Time, Timestamp, isInvalidDate } from "./time.js";

/** Convert `Date` to `Day`.
@throws {ErrorInvalidDate}
*/
export const getDayFromDate = (date: Date): Day => {
  return getDayFromTimestamp(getTimestampFromDate(date));
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
  // Invalid dates return a null JSON
  //     new Date('0000-00-00').toJSON() // null
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
  return date.toJSON();
};

/** Convert `Day` to `Timestamp`. */
export const getTimestampFromDay = (day: Day): Timestamp => {
  return new Date(day).toJSON();
};

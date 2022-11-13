import { ErrorInvalidDate } from "./errors.js";
import { Day, Time, Timestamp, isInvalidDate } from "./time.js";

/** Convert `Date` to `Day`.
@throws {ErrorInvalidDate} */
export const dateToDay = (date: Date): Day =>
  timestampToDay(dateToTimestamp(date));

/** Convert `Time` to `Day`. */
export const timeToDay = (time: Time): Day => dateToDay(new Date(time));

/** Convert `Timestamp` to `Day`. */
export const timestampToDay = (timestamp: Timestamp): Day =>
  timestamp.substring(0, 10);

/** Convert `Timestamp` to `Time`. */
export const timestampToTime = (timestamp: Timestamp): Time =>
  new Date(timestamp).getTime();

/** Convert `Date` to `Timestamp`.
@throws {ErrorInvalidDate} */
export const dateToTimestamp = (date: Date): Timestamp => {
  // Invalid dates return a null JSON
  //     new Date('0000-00-00').toJSON() // null
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
  return date.toJSON();
};

/** Convert `Day` to `Timestamp`. */
export const dayToTimestamp = (day: Day): Timestamp => {
  return new Date(day).toJSON();
};

import { ErrorInvalidDate } from "./errors.js";
import { getDate } from "./operators.js";
import {
  DateInterval,
  Day,
  DayInterval,
  Time,
  TimeInterval,
  Timestamp,
  isInvalidDate,
} from "./time.js";

/** Convert `Date` to `Time`.
@throws {ErrorInvalidDate} */
export const dateToTime = (date: Date): Time => {
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
  return date.getTime();
};

/** Convert `Day` to `Date`.
@throws {ErrorInvalidDate} */
export const dayToDate = (day: Day): Date => new Date(day);

/** Convert `Day` to `Time`.
@throws {ErrorInvalidDate} */
export const dayToTime = (day: Day): Time => dateToTime(dayToDate(day));

/** Convert `DateInterval` to `TimeInterval`.
@throws {ErrorInvalidDate} */
export const dateIntervalToTime = ({
  start,
  end,
}: DateInterval): TimeInterval => ({
  start: dateToTime(start),
  end: dateToTime(end),
});

/** Convert `DayInterval` to `DateInterval`.
@throws {ErrorInvalidDate} */
export const dayIntervalToDate = ({
  start,
  end,
}: DayInterval): DateInterval => ({
  start: dayToDate(start),
  end: getDate(getDate(dayToDate(end)).plus(1).days())
    .minus(1)
    .seconds(),
});

/** Convert `DayInterval` to `TimeInterval`.
@throws {ErrorInvalidDate} */
export const dayIntervalToTime = (interval: DayInterval): TimeInterval =>
  dateIntervalToTime(dayIntervalToDate(interval));

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

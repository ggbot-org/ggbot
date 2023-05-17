import { DateInterval, isInvalidDate } from "./date.js";
import { Day, DayInterval } from "./day.js";
import { ErrorInvalidDate } from "./errors.js";
import { getDate } from "./operators.js";
import { Time, TimeInterval } from "./time.js";
import { Timestamp } from "./timestamp.js";

/**
 * Convert `Date` to `Time`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dateToTime = (date: Date): Time => {
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
  return date.getTime();
};

/**
 * Convert `Day` to `Date`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dayToDate = (day: Day): Date => new Date(day);

/**
 * Convert `Day` to `Time`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dayToTime = (day: Day): Time => dateToTime(dayToDate(day));

/**
 * Convert `DateInterval` to `TimeInterval`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dateIntervalToTime = ({
  start,
  end,
}: DateInterval): TimeInterval => ({
  start: dateToTime(start),
  end: dateToTime(end),
});

/**
 * Convert `DayInterval` to `DateInterval`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dayIntervalToDate = ({
  start,
  end,
}: DayInterval): DateInterval => ({
  start: dayToDate(start),
  end: getDate(getDate(dayToDate(end)).plus(1).days())
    .minus(1)
    .seconds(),
});

/**
 * Convert `DayInterval` to `TimeInterval`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dayIntervalToTime = (dayInterval: DayInterval): TimeInterval => {
  const dateInterval = dayIntervalToDate(dayInterval);
  return dateIntervalToTime(dateInterval);
};

/**
 * Convert `Date` to `Day`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dateToDay = (date: Date): Day => {
  const timestamp = dateToTimestamp(date);
  return timestampToDay(timestamp);
};

/** Convert `Time` to `Day`. */
export const timeToDay = (time: Time): Day => {
  const date = timeToDate(time);
  return dateToDay(date);
};

/**
 * Convert `TimeInterval` to `DayInterval`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const timeIntervalToDay = ({
  start,
  end,
}: TimeInterval): DayInterval => ({
  start: timeToDay(start),
  end: timeToDay(end),
});

/** Convert `Timestamp` to `Day`. */
export const timestampToDay = (timestamp: Timestamp): Day =>
  timestamp.substring(0, 10);

/** Convert `Timestamp` to `Time`. */
export const timestampToTime = (timestamp: Timestamp): Time => {
  const date = timestampToDate(timestamp);
  return dateToTime(date);
};

/**
 * Convert `Date` to `Timestamp`.
 *
 * @throws {@link ErrorInvalidDate}
 */
export const dateToTimestamp = (date: Date): Timestamp => {
  // Invalid dates return a null JSON
  //     new Date('0000-00-00').toJSON() // null
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
  return date.toJSON();
};

/** Convert `Day` to `Timestamp`. */
export const dayToTimestamp = (day: Day): Timestamp => new Date(day).toJSON();

/** Convert `Time` to `Date`. */
export const timeToDate = (time: Time): Date => new Date(time);

/** Convert `Time` to `Timestamp`. */
export const timeToTimestamp = (time: Time): Timestamp => {
  const date = timeToDate(time);
  return dateToTimestamp(date);
};

/** Convert `Timestamp` to `Date`. */
export const timestampToDate = (timestamp: Timestamp): Date =>
  new Date(timestamp);

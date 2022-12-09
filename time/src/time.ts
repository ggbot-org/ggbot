import { NaturalNumber, isNaturalNumber } from "@ggbot2/type-utils";

/** Generic time interval*/
type Interval<T> = {
  end: T;
  start: T;
};

// Time Units ////////////////////////////////////////////////////////

export const timeUnits = ["second", "minute", "hour", "day"];
export type TimeUnit = typeof timeUnits[number];
export const isTimeUnit = (arg: unknown): arg is TimeUnit =>
  typeof arg === "string" && (timeUnits as readonly string[]).includes(arg);

export const coerceToTimeUnit = (arg: string): TimeUnit | undefined => {
  if (isTimeUnit(arg)) return arg;
  if (["1s", "seconds"]) return "second";
  if (["1m", "minutes"]) return "minute";
  if (["1h", "hours"]) return "hour";
  if (["1d", "days"]) return "day";
  return;
};

// Date //////////////////////////////////////////////////////////////

/* `Date` is already built in JavaScript */

export const isInvalidDate = (arg: Date) => arg.toString() === "Invalid Date";

export type DateInterval = Interval<Date>;
export const isDateInterval = (arg: unknown): arg is DateInterval => {
  if (typeof arg !== "object" || arg === null) return false;
  const { start, end } = arg as Partial<DateInterval>;
  return (
    start instanceof Date &&
    !isInvalidDate(start) &&
    end instanceof Date &&
    !isInvalidDate(end) &&
    start <= end
  );
};

// Time //////////////////////////////////////////////////////////////

/** The number of milliseconds since the @link{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps|ECMAScript epoch}.*/
export type Time = NaturalNumber;

export const isTime = (arg: unknown): arg is Time => isNaturalNumber(arg);

export type TimeInterval = Interval<Time>;
export const isTimeInterval = (arg: unknown): arg is TimeInterval => {
  if (typeof arg !== "object" || arg === null) return false;
  const { start, end } = arg as Partial<TimeInterval>;
  return isTime(start) && isTime(end) && start <= end;
};

// Timestamp /////////////////////////////////////////////////////////

/** String with format yyyy-mm-ddThh:mm:ss.lllZ */
export type Timestamp = string;

const timestampLength = 24;

export const isTimestamp = (arg: unknown): arg is Timestamp => {
  if (typeof arg !== "string") return false;
  if (arg.length !== timestampLength) return false;
  const date = new Date(arg);
  return !isInvalidDate(date);
};

export const now = (): Time => new Date().getTime();

// Hour ////////////////////////////////////////////////////////////////

export const hours = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
] as const;

/** String with format HH, from 00 to 23. */
export type Hour = typeof hours[number];

export const isHour = (arg: unknown): arg is Hour => {
  if (typeof arg !== "string") return false;
  return (hours as readonly string[]).includes(arg);
};

// Day ////////////////////////////////////////////////////////////////

/** String with format yyyy-mm-dd */
export type Day = string;

export const isDay = (arg: unknown): arg is Day => {
  if (typeof arg !== "string") return false;
  const date = new Date(arg);
  if (isInvalidDate(date)) return false;
  const day = date.toJSON().substring(0, 10);
  return day === arg;
};

export type DayInterval = Interval<Day>;
export const isDayInterval = (arg: unknown): arg is DayInterval => {
  if (typeof arg !== "object" || arg === null) return false;
  const { start, end } = arg as Partial<DayInterval>;
  return isDay(start) && isDay(end);
};

export const today = (): Day => new Date().toJSON().substring(0, 10);

type YYYY = string;
type MM = string;
type DD = string;

export type SplittedDay = [YYYY, MM, DD];

export const isSplittedDay = (arg: unknown): arg is SplittedDay =>
  Array.isArray(arg) &&
  arg.every((item) => typeof item === "string") &&
  isDay(arg.join("-"));

export const splitDay = (day: Day): SplittedDay => {
  const [yyyy, mm, dd] = day.split("-");
  return [yyyy, mm, dd];
};

export const joinDay = ([yyyy, mm, dd]: SplittedDay): Day =>
  [yyyy, mm, dd].join("-");

// Week ///////////////////////////////////////////////////////////////

export const weekDayNums = [0, 1, 2, 3, 4, 5, 6] as const;

/** Week day num as returned by `new Date().getDate()`. */
export type WeekDayNum = typeof weekDayNums[number];

// Month //////////////////////////////////////////////////////////////

export const monthNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

/** Month num as returned by `new Date().getMonth()`. */
export type MonthNum = typeof monthNums[number];

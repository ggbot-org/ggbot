// Time Units
// /////////////////////////////////////////////////////////////////////////////

export const timeUnits = ["second", "minute", "hour", "day"];
export type TimeUnit = typeof timeUnits[number];

// Date
// /////////////////////////////////////////////////////////////////////////////

export const isInvalidDate = (arg: Date) => arg.toString() === "Invalid Date";

// Time
// /////////////////////////////////////////////////////////////////////////////

/** The number of milliseconds since the @link{https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_ecmascript_epoch_and_timestamps|ECMAScript epoch}.*/
export type Time = number;

export const isTime = (arg: unknown): arg is Time => {
  if (typeof arg !== "number") return false;
  return arg > 0;
};

// Timestamp
// /////////////////////////////////////////////////////////////////////////////

/** String with format yyyy-mm-ddThh:mm:ss.lllZ */
export type Timestamp = string;

const timestampLength = 24;

export const isTimestamp = (arg: unknown): arg is Timestamp => {
  if (typeof arg !== "string") return false;
  if (arg.length !== timestampLength) return false;
  const date = new Date(arg);
  return !isInvalidDate(date);
};

export type Now = () => Timestamp;

export const now: Now = () => new Date().toJSON();

// Hour
// /////////////////////////////////////////////////////////////////////////////

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

// Day
// /////////////////////////////////////////////////////////////////////////////

/** String with format yyyy-mm-dd */
export type Day = string;

export const isDay = (arg: unknown): arg is Day => {
  if (typeof arg !== "string") return false;
  const date = new Date(arg);
  if (isInvalidDate(date)) return false;
  const day = date.toJSON().substring(0, 10);
  return day === arg;
};

export type Today = () => Day;

export const today = () => new Date().toJSON().substring(0, 10);

type YYYY = string;
type MM = string;
type DD = string;

export type SplittedDay = [YYYY, MM, DD];

export const splitDay = (day: Day): SplittedDay => {
  const [yyyy, mm, dd] = day.split("-");
  return [yyyy, mm, dd];
};

// Week
// /////////////////////////////////////////////////////////////////////////////

export const weekDayNums = [0, 1, 2, 3, 4, 5, 6] as const;

/** Week day num as returned by `new Date().getDate()`. */
export type WeekDayNum = typeof weekDayNums[number];

// Month
// /////////////////////////////////////////////////////////////////////////////

export const monthNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

/** Month num as returned by `new Date().getMonth()`. */
export type MonthNum = typeof monthNums[number];

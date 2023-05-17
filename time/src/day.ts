import { objectTypeGuard } from "@ggbot2/type-utils";

import { isInvalidDate } from "./date.js";
import { Interval } from "./interval.js";

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
export const isDayInterval = objectTypeGuard<DayInterval>(
  ({ start, end }) => isDay(start) && isDay(end)
);

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

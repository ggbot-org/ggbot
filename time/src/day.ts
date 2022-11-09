import { isValidDate } from "./date.js";

/** String with format yyyy-mm-dd */
export type Day = string;

export const isDay = (arg: unknown): arg is Day => {
  if (typeof arg !== "string") return false;
  const maybeDate = new Date(arg);
  if (!isValidDate(maybeDate)) return false;
  const dateString = maybeDate.toJSON();
  const day = dateString.substring(0, 10);
  return day === arg;
};

type YYYY = string;
type MM = string;
type DD = string;

export type SplittedDay = [YYYY, MM, DD];

export const splitDay = (day: Day): SplittedDay => {
  const [yyyy, mm, dd] = day.split("-");
  return [yyyy, mm, dd];
};

export type Today = () => Day;

export const today = () => new Date().toJSON().substring(0, 10);

import { ErrorInvalidDate } from "./errors.js";

/** String with format yyyy-mm-dd */
export type Day = string;

export const isDay = (arg: unknown): arg is Day => {
  if (typeof arg !== "string") return false;
  try {
    const maybeDate = new Date(arg);
    return getDayFromDate(maybeDate) === arg;
  } catch {
    return false;
  }
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

/**
Convert `Date` to `Day`.

@throws {ErrorInvalidDate}
*/
export const getDayFromDate = (date: Date): Day => {
  // Notice that invalid dates could return a null JSON
  //
  //     new Date('0000-00-00').toJSON() // null
  const dateString = date.toJSON();

  if (typeof dateString === "string") return dateString.substring(0, 10);

  throw new ErrorInvalidDate();
};

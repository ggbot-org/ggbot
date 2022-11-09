import type { Day } from "./day.js";
import type { Time } from "./time.js";
import type { Timestamp } from "./timestamp.js";

/** `ValidDateArg` is any argument, excluding `undefined`, that the Date constructor will parse into a valid date. */
export type ValidDateArg = Date | string | number | Day | Time | Timestamp;

export const isValidDateArg = (arg: unknown): arg is ValidDateArg => {
  if (
    arg instanceof Date ||
    typeof arg === "string" ||
    typeof arg === "number"
  ) {
    const date = new Date(arg);
    return date.toString() !== "Invalid Date";
  }
  return false;
};

export const addDays = (num: number, arg: ValidDateArg): ValidDateArg => {
  const date = new Date(arg);
  date.setDate(date.getDate() + num);
  return date;
};

export const addMinutes = (num: number, arg: ValidDateArg): ValidDateArg => {
  const date = new Date(arg);
  date.setMinutes(date.getMinutes() + num);
  return date;
};

export const addSeconds = (num: number, arg: ValidDateArg): ValidDateArg => {
  const date = new Date(arg);
  date.setSeconds(date.getSeconds() + num);
  return date;
};

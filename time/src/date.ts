import { getDayFromDate } from "./day.js";

export type ValidDate = Date;

export const isValidDate = (arg: unknown): arg is ValidDate => {
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

export const addDays = (num: number, date: Date): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + num);
  return d;
};

export const addMinutes = (num: number, date: Date): Date => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + num);
  return d;
};

export const addSeconds = (num: number, date: Date): Date => {
  const d = new Date(date);
  d.setSeconds(d.getSeconds() + num);
  return d;
};

export const truncateDate = (date: Date): Date => {
  const day = getDayFromDate(date);
  if (day === null) throw new TypeError(`Invalid Date ${date}`);
  return new Date(day);
};

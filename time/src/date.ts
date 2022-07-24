import { getDayFromDate } from "./day.js";

export type ValidDate = Date;

export const isValidDate = (value: unknown): value is ValidDate => {
  if (
    value instanceof Date ||
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const date = new Date(value);
    return date.toString() !== "Invalid Date";
  }
  return false;
};

export const addDays = (value: number, date: Date): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + value);
  return d;
};

export const addMinutes = (value: number, date: Date): Date => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + value);
  return d;
};

export const addSeconds = (value: number, date: Date): Date => {
  const d = new Date(date);
  d.setSeconds(d.getSeconds() + value);
  return d;
};

export const truncateDate = (date: Date) => {
  const day = getDayFromDate(date);
  if (day === null) throw new TypeError(`Invalid Date ${date}`);
  return new Date(day);
};

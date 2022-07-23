import { getDayFromDate } from "./day.js";

export type ValidDate = Date;

export function isValidDate(value: unknown): value is ValidDate {
  if (
    value instanceof Date ||
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const date = new Date(value);
    return date.toString() !== "Invalid Date";
  }
  return false;
}

export const truncateDate = (date: Date) => {
  const day = getDayFromDate(date);
  if (day === null) throw new TypeError(`Invalid Date ${date}`);
  return new Date(day);
};

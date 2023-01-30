import { isInvalidDate } from "./date.js";

/** String with format yyyy-mm-ddThh:mm:ss.lllZ */
export type Timestamp = string;

const timestampLength = 24;

export const isTimestamp = (arg: unknown): arg is Timestamp => {
  if (typeof arg !== "string") return false;
  if (arg.length !== timestampLength) return false;
  const date = new Date(arg);
  return !isInvalidDate(date);
};

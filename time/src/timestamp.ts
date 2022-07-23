import { isValidDate } from "./date.js";

/**
 * String with format yyyy-mm-ddThh:mm:ss.lllZ
 */
export type Timestamp = string;

const timestampLength = 24;

export function isTimestamp(value: unknown): value is Timestamp {
  if (typeof value !== "string") return false;
  if (value.length !== timestampLength) return false;
  const date = new Date(value);
  return isValidDate(date);
}

export type Now = () => Timestamp;

export const now: Now = () => new Date().toJSON();

import { isValidDate } from "./date.js";

/**
 * String with format yyyy-mm-ddThh:mm:ss.lllZ
 */
export type Timestamp = string;

const timestampLength = 24;

export const isTimestamp = (value: unknown): value is Timestamp => {
  if (typeof value !== "string") return false;
  if (value.length !== timestampLength) return false;
  const date = new Date(value);
  return isValidDate(date);
};

export type Now = () => Timestamp;

export const now: Now = () => new Date().toJSON();

export const timestampTruncations = ["second", "minute", "hour"];
export type TimestampTruncation = typeof timestampTruncations[number];

type TruncateTimestamp = (arg?: Timestamp) => {
  to: (arg: TimestampTruncation) => Timestamp;
};

export const truncateTimestamp: TruncateTimestamp = (timestamp = now()) => {
  const date = new Date(timestamp);
  return {
    to: (truncation) => {
      date.setMilliseconds(0);
      if (["minute", "hour"].includes(truncation)) date.setUTCSeconds(0);
      if (["hour"].includes(truncation)) date.setUTCMinutes(0);
      return date.toJSON();
    },
  };
};

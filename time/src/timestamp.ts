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

export type TruncateTimestamp = (arg: {
  value: unknown;
  to: TimestampTruncation;
}) => Timestamp;

export const truncateTimestamp: TruncateTimestamp = ({
  value,
  to: truncation,
}) => {
  if (!isTimestamp(value)) throw new TypeError(`Invalid timestamp ${value}`);
  const date = new Date(value);
  switch (truncation) {
    case "second":
      date.setMilliseconds(0);
      break;
    case "minute":
      date.setMilliseconds(0);
      date.setSeconds(0);
      break;
    case "hour":
      date.setMilliseconds(0);
      date.setSeconds(0);
      date.setMinutes(0);
      break;
    default:
      throw new TypeError(`Unhandled truncation ${truncation}`);
  }
  return date.toJSON();
};

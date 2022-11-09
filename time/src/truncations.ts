import { ErrorInvalidDate } from "./errors";
import { isValidDateArg, ValidDateArg } from "./date";
import { Timestamp } from "./timestamp.js";

export const timeTruncations = ["second", "minute", "hour", "day"];
export type TimeTruncation = typeof timeTruncations[number];

type Truncate<Input, Output> = (arg: Input) => {
  to: Record<TimeTruncation, () => Output>;
};

/** Truncate `Date`.
@throws ErrorInvalidDate
*/
export const truncateDate: Truncate<ValidDateArg, Date> = (arg) => {
  if (!isValidDateArg(arg)) throw new ErrorInvalidDate(arg);
  const date = new Date(arg);
  return {
    to: {
      second: () => {
        date.setMilliseconds(0);
        return date;
      },
      minute: () => {
        date.setMilliseconds(0);
        date.setUTCSeconds(0);
        return date;
      },
      hour: () => {
        date.setMilliseconds(0);
        date.setUTCSeconds(0);
        date.setUTCMinutes(0);
        return date;
      },
      day: () => {
        date.setMilliseconds(0);
        date.setUTCSeconds(0);
        date.setUTCMinutes(0);
        date.setUTCHours(0);
        return date;
      },
    },
  };
};

/** Truncate `Timestamp`. */
export const truncateTimestamp: Truncate<Timestamp, Timestamp> = (
  timestamp
) => ({
  to: {
    second: () => truncateDate(new Date(timestamp)).to.second().toJSON(),
    minute: () => truncateDate(new Date(timestamp)).to.minute().toJSON(),
    hour: () => truncateDate(new Date(timestamp)).to.hour().toJSON(),
    day: () => truncateDate(new Date(timestamp)).to.day().toJSON(),
  },
});

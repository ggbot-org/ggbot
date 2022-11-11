import { ErrorInvalidDate } from "./errors.js";
import { Time, Timestamp, TimeUnit, isInvalidDate } from "./time.js";

type TimeTruncator<Input, Output> = (arg: Input) => {
  to: Record<TimeUnit, () => Output>;
};

type TimeTranslationUnits<TimeType> = {
  months: () => TimeType;
  days: () => TimeType;
  hours: () => TimeType;
  minutes: () => TimeType;
  seconds: () => TimeType;
};

type TimeTranslator<TimeType> = (arg: TimeType) => {
  plus: (num: number) => TimeTranslationUnits<TimeType>;
  minus: (num: number) => TimeTranslationUnits<TimeType>;
};

/** Translate `Date`.
@throws ErrorInvalidDate */
export const getDate: TimeTranslator<Date> = (date) => {
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
  return {
    plus: (num) => ({
      months: () => {
        date.setDate(date.getMonth() + num);
        return date;
      },
      days: () => {
        date.setDate(date.getDate() + num);
        return date;
      },
      hours: () => {
        date.setDate(date.getHours() + num);
        return date;
      },
      minutes: () => {
        date.setMinutes(date.getMinutes() + num);
        return date;
      },
      seconds: () => {
        date.setSeconds(date.getSeconds() + num);
        return date;
      },
    }),
    minus: (num) => ({
      months: () => {
        date.setDate(date.getMonth() - num);
        return date;
      },
      days: () => {
        date.setDate(date.getDate() - num);
        return date;
      },
      hours: () => {
        date.setDate(date.getHours() - num);
        return date;
      },
      minutes: () => {
        date.setMinutes(date.getMinutes() - num);
        return date;
      },
      seconds: () => {
        date.setSeconds(date.getSeconds() - num);
        return date;
      },
    }),
  };
};

/** Translate `Time`. */
export const getTime: TimeTranslator<Time> = (time) => {
  const date = new Date(time);
  return {
    plus: (num) => ({
      months: () => getDate(date).plus(num).months().getTime(),
      days: () => getDate(date).plus(num).days().getTime(),
      hours: () => getDate(date).plus(num).hours().getTime(),
      minutes: () => getDate(date).plus(num).minutes().getTime(),
      seconds: () => getDate(date).plus(num).seconds().getTime(),
    }),
    minus: (num) => ({
      months: () => getDate(date).minus(num).months().getTime(),
      days: () => getDate(date).minus(num).days().getTime(),
      hours: () => getDate(date).minus(num).hours().getTime(),
      minutes: () => getDate(date).minus(num).minutes().getTime(),
      seconds: () => getDate(date).minus(num).seconds().getTime(),
    }),
  };
};

/** Truncate `Date`.
@throws ErrorInvalidDate */
export const truncateDate: TimeTruncator<Date, Date> = (date) => {
  if (isInvalidDate(date)) throw new ErrorInvalidDate();
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
export const truncateTimestamp: TimeTruncator<Timestamp, Timestamp> = (
  timestamp
) => ({
  to: {
    second: () => truncateDate(new Date(timestamp)).to.second().toJSON(),
    minute: () => truncateDate(new Date(timestamp)).to.minute().toJSON(),
    hour: () => truncateDate(new Date(timestamp)).to.hour().toJSON(),
    day: () => truncateDate(new Date(timestamp)).to.day().toJSON(),
  },
});

import {
  dateToDay,
  dateToTime,
  dateToTimestamp,
  dayToDate,
  timeToDate,
  timestampToDate,
} from "./conversions.js";
import { isInvalidDate } from "./date.js";
import { Day } from "./day.js";
import { ErrorInvalidDate } from "./errors.js";
import { Time } from "./time.js";
import { Timestamp } from "./timestamp.js";
import { TimeUnit } from "./units.js";

type TimeTruncator<Input, Output> = (arg: Input) => {
  to: Record<TimeUnit, () => Output>;
};

type TimeTranslationUnits<TimeType> = {
  years: () => TimeType;
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

/**
 * Translate `Date`.
 *
 * @throws ErrorInvalidDate
 */
export const getDate: TimeTranslator<Date> = (input) => {
  if (isInvalidDate(input)) throw new ErrorInvalidDate();
  const date = new Date(input);
  return {
    plus: (num) => ({
      years: () => {
        date.setFullYear(date.getFullYear() + num);
        return date;
      },
      months: () => {
        date.setMonth(date.getMonth() + num);
        return date;
      },
      days: () => {
        date.setDate(date.getDate() + num);
        return date;
      },
      hours: () => {
        date.setHours(date.getHours() + num);
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
      years: () =>
        getDate(date)
          .plus(-1 * num)
          .years(),
      months: () =>
        getDate(date)
          .plus(-1 * num)
          .months(),
      days: () =>
        getDate(date)
          .plus(-1 * num)
          .days(),
      hours: () =>
        getDate(date)
          .plus(-1 * num)
          .hours(),
      minutes: () =>
        getDate(date)
          .plus(-1 * num)
          .minutes(),
      seconds: () =>
        getDate(date)
          .plus(-1 * num)
          .seconds(),
    }),
  };
};

/** Translate `Day`. */
export const getDay: TimeTranslator<Day> = (day) => {
  const date = dayToDate(day);
  return {
    plus: (num) => ({
      years: () => dateToDay(getDate(date).plus(num).years()),
      months: () => dateToDay(getDate(date).plus(num).months()),
      days: () => dateToDay(getDate(date).plus(num).days()),
      hours: () => dateToDay(getDate(date).plus(num).hours()),
      minutes: () => dateToDay(getDate(date).plus(num).minutes()),
      seconds: () => dateToDay(getDate(date).plus(num).seconds()),
    }),
    minus: (num) => ({
      years: () =>
        getDay(day)
          .plus(-1 * num)
          .years(),
      months: () =>
        getDay(day)
          .plus(-1 * num)
          .months(),
      days: () =>
        getDay(day)
          .plus(-1 * num)
          .days(),
      hours: () =>
        getDay(day)
          .plus(-1 * num)
          .hours(),
      minutes: () =>
        getDay(day)
          .plus(-1 * num)
          .minutes(),
      seconds: () =>
        getDay(day)
          .plus(-1 * num)
          .seconds(),
    }),
  };
};

/** Translate `Time`. */
export const getTime: TimeTranslator<Time> = (time) => {
  const date = timeToDate(time);
  return {
    plus: (num) => ({
      years: () => dateToTime(getDate(date).plus(num).years()),
      months: () => dateToTime(getDate(date).plus(num).months()),
      days: () => dateToTime(getDate(date).plus(num).days()),
      hours: () => dateToTime(getDate(date).plus(num).hours()),
      minutes: () => dateToTime(getDate(date).plus(num).minutes()),
      seconds: () => dateToTime(getDate(date).plus(num).seconds()),
    }),
    minus: (num) => ({
      years: () =>
        getTime(time)
          .plus(-1 * num)
          .years(),
      months: () =>
        getTime(time)
          .plus(-1 * num)
          .months(),
      days: () =>
        getTime(time)
          .plus(-1 * num)
          .days(),
      hours: () =>
        getTime(time)
          .plus(-1 * num)
          .hours(),
      minutes: () =>
        getTime(time)
          .plus(-1 * num)
          .minutes(),
      seconds: () =>
        getTime(time)
          .plus(-1 * num)
          .seconds(),
    }),
  };
};

/**
 * Truncate `Date`.
 *
 * @throws ErrorInvalidDate
 */
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

/** Truncate `Time`. */
export const truncateTime: TimeTruncator<Time, Time> = (time) => {
  const date = timeToDate(time);
  return {
    to: {
      second: () => dateToTime(truncateDate(date).to.second()),
      minute: () => dateToTime(truncateDate(date).to.minute()),
      hour: () => dateToTime(truncateDate(date).to.hour()),
      day: () => dateToTime(truncateDate(date).to.day()),
    },
  };
};

/** Truncate `Timestamp`. */
export const truncateTimestamp: TimeTruncator<Timestamp, Timestamp> = (
  timestamp
) => {
  const date = timestampToDate(timestamp);
  return {
    to: {
      second: () => dateToTimestamp(truncateDate(date).to.second()),
      minute: () => dateToTimestamp(truncateDate(date).to.minute()),
      hour: () => dateToTimestamp(truncateDate(date).to.hour()),
      day: () => dateToTimestamp(truncateDate(date).to.day()),
    },
  };
};

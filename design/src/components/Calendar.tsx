import {
  dateToDay,
  Day,
  MonthNum,
  today,
  WeekDayNum,
  weekDayNums,
} from "@ggbot2/time";
import { FC, useCallback, useMemo, useState } from "react";

import { _classNames } from "./_classNames.js";
import { Icon } from "./Icon.js";

export type CalendarClassNames =
  | "Calendar"
  | "Calendar__body"
  | "Calendar__head"
  | "Calendar__week-day"
  | "Calendar__cell";

export type CalendarMonthNameRecord = Record<MonthNum, string>;

export type CalendarWeekDayNameRecord = Record<WeekDayNum, string>;

export type CalendarSetSelectedDay = (arg: Day) => void;

export type CalendarProps = {
  monthName?: CalendarMonthNameRecord;
  min?: Day;
  max?: Day;
  selectedDay?: Day;
  setSelectedDay?: CalendarSetSelectedDay;
  weekDayName?: CalendarWeekDayNameRecord;
};

export const Calendar: FC<CalendarProps> = ({
  min,
  max,
  monthName = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  },
  weekDayName = {
    0: "Su",
    1: "Mo",
    2: "Tu",
    3: "We",
    4: "Th",
    5: "Fr",
    6: "Sa",
  },
  selectedDay = today(),
  setSelectedDay,
}) => {
  const [monthOffset, setMonthOffset] = useState(0);

  const firstDate = useMemo<Date>(() => {
    const date = new Date(selectedDay);
    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);
    return date;
  }, [monthOffset, selectedDay]);

  const lastDate = useMemo<Date>(() => {
    const date = new Date(firstDate);
    date.setMonth(date.getMonth() + monthOffset + 1);
    date.setDate(date.getDate() - 1);
    return date;
  }, [monthOffset, firstDate]);

  const monthNum = firstDate.getMonth() as MonthNum;

  const datesBeforeFirstDate = useMemo(() => {
    const dates: Date[] = [];
    const weekDay = firstDate.getDay();
    for (let i = weekDay; i > 0; i--) {
      const date = new Date(firstDate);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  }, [firstDate]);

  const datesOfMonth = useMemo(() => {
    const dates: Date[] = [firstDate];
    const n = lastDate.getDate();
    for (let i = 1; i < n; i++) {
      const date = new Date(firstDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [firstDate, lastDate]);

  const datesAfterLastDate = useMemo(() => {
    const dates: Date[] = [];
    const weekDate = lastDate.getDay();
    for (let i = 1; i < 7 - weekDate; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [lastDate]);

  const firstDay = dateToDay(firstDate);
  const isFirstMonth = firstDay && min && firstDay <= min;

  const lastDay = dateToDay(lastDate);
  const isLastMonth = lastDay && max && lastDay >= max;

  const dateCells = useMemo(
    () =>
      [
        ...datesBeforeFirstDate.map((date) => ({
          date,
          isDateOfCurrentMonth: false,
        })),
        ...datesOfMonth.map((date) => ({ date, isDateOfCurrentMonth: true })),
        ...datesAfterLastDate.map((date) => ({
          date,
          isDateOfCurrentMonth: false,
        })),
      ]
        .map(({ date, ...rest }) => ({
          day: dateToDay(date),
          date,
          ...rest,
        }))
        .map(({ day, ...rest }) => ({
          selected: day === selectedDay,
          isSelectable:
            day !== selectedDay &&
            (min && day ? day >= min : true) &&
            (max && day ? day <= max : true),
          day,
          ...rest,
        }))
        .map(({ date, day, isDateOfCurrentMonth, isSelectable, selected }) => ({
          day,
          isDateOfCurrentMonth,
          onClick:
            day && isSelectable
              ? () => {
                  setSelectedDay?.(day);
                  setMonthOffset(0);
                }
              : undefined,
          num: date.getDate(),
          selected,
        })),
    [
      datesBeforeFirstDate,
      datesOfMonth,
      datesAfterLastDate,
      min,
      max,
      selectedDay,
      setSelectedDay,
      setMonthOffset,
    ]
  );

  const leftCaretClassName = useMemo(
    () => ["text-sm", isFirstMonth ? "neutral" : ""].join(" "),
    [isFirstMonth]
  );

  const onClickPrevious = useCallback(() => {
    setMonthOffset((n) => n - 1);
  }, [setMonthOffset]);

  const onClickNext = useCallback(() => {
    setMonthOffset((n) => n + 1);
  }, [setMonthOffset]);

  return (
    <div className={_classNames("Calendar")}>
      <div className={_classNames("Calendar__head")}>
        <div>
          <span className={leftCaretClassName}>
            <Icon
              name="caret-left"
              onClick={isFirstMonth ? undefined : onClickPrevious}
            />
          </span>

          <span>{monthName[monthNum]}</span>
        </div>

        <div>
          <span>{firstDate.getFullYear()}</span>

          <span>
            <Icon
              name="caret-right"
              onClick={isLastMonth ? undefined : onClickNext}
            />
          </span>
        </div>
      </div>

      <div className={_classNames("Calendar__body")}>
        {weekDayNums.map((n) => (
          <div key={n} className={_classNames("Calendar__week-day")}>
            {weekDayName[n]}
          </div>
        ))}

        {dateCells.map(({ day, num, onClick, selected }) => (
          <div
            key={day}
            className={_classNames("Calendar__cell", {
              "has-background-primary": selected,
            })}
            onClick={onClick}
          >
            {num}
          </div>
        ))}

        {
          /* Avoid layout shifting: in case there are 5 rows, fill with an empty row. */
          dateCells.length === 35
            ? [0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i}>&nbsp;</div>)
            : null
        }
      </div>
    </div>
  );
};

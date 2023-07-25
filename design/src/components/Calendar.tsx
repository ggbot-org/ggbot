import {
  dateToDay,
  Day,
  MonthNum,
  WeekDayNum,
  weekDayNums,
} from "@ggbot2/time";
import { FC, MouseEventHandler, useCallback, useMemo, useState } from "react";

import { _classNames } from "../components/_classNames.js";
import { Icon } from "../components/Icon.js";

export type CalendarClassNames =
  | "Calendar"
  | "Calendar__body"
  | "Calendar__head"
  | "Calendar__head-icon"
  | "Calendar__head-text"
  | "Calendar__week-day"
  | "Calendar__cell";

export type CalendarMonthNameRecord = Record<MonthNum, string>;

export type CalendarWeekDayNameRecord = Record<WeekDayNum, string>;

export type CalendarProps = {
  monthName?: CalendarMonthNameRecord;
  min?: Day;
  max?: Day;
  day: Day;
  setDay: (arg: Day) => void;
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
  day: selectedDay,
  setDay: setSelectedDay,
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
            (min && day ? day >= min : true) &&
            (max && day ? day <= max : true),
          day,
          ...rest,
        }))
        .map(({ date, day, isDateOfCurrentMonth, isSelectable, selected }) => {
          const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
            if (isSelectable) {
              setSelectedDay(day);
              setMonthOffset(0);
            } else {
              event.stopPropagation();
            }
          };
          return {
            day,
            isDateOfCurrentMonth,
            isSelectable,
            num: date.getDate(),
            onClick,
            selected,

            // Need a random key, using day and monthNum is not enough,
            // it can raise React warning:
            //
            //     Encountered two children with the same key.
            //
            key: Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, "")
              .substring(0, 5),
          };
        }),
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

  const onClickPrevious = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      event.stopPropagation();
      setMonthOffset((n) => n - 1);
    },
    [setMonthOffset]
  );

  const onClickNext = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      event.stopPropagation();
      setMonthOffset((n) => n + 1);
    },
    [setMonthOffset]
  );

  return (
    <div className={_classNames("Calendar")}>
      <div
        className={_classNames("Calendar__head")}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className={_classNames("Calendar__head-icon")}
          onClick={onClickPrevious}
        >
          <Icon name="caret-left" />
        </div>

        <div className={_classNames("Calendar__head-text")}>
          {monthName[monthNum]}
        </div>

        <div className={_classNames("Calendar__head-text")}>
          {firstDate.getFullYear()}
        </div>

        <div
          className={_classNames("Calendar__head-icon")}
          onClick={onClickNext}
        >
          <Icon name="caret-right" />
        </div>
      </div>

      <div className={_classNames("Calendar__body")}>
        {weekDayNums.map((n) => (
          <div key={n} className={_classNames("Calendar__week-day")}>
            {weekDayName[n]}
          </div>
        ))}

        {dateCells.map(({ isSelectable, key, num, onClick, selected }) => (
          <div
            key={key}
            className={_classNames("Calendar__cell", {
              "has-background-primary": selected,
              "has-text-grey-light": !isSelectable,
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

import {Day, getDateFromDay, getDayFromDate, today} from "@ggbot2/time";
import {FC, useCallback, useMemo, useState} from "react";
import {Icon} from "./Icon";

const calendarMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export type CalendarMonth = typeof calendarMonths[number];
export type CalendarMonthNameRecord = Record<CalendarMonth, string>;

const calendarWeekDays = [0, 1, 2, 3, 4, 5, 6] as const;
export type CalendarWeekDay = typeof calendarWeekDays[number];
export type CalendarWeekDayNameRecord = Record<CalendarWeekDay, string>;

export type CalendarProps = {
  monthName?: CalendarMonthNameRecord;
  min?: Day;
  max?: Day;
  selectedDay?: Day;
  setSelectedDay?: (_: Day) => void;
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
    const date = getDateFromDay(selectedDay);
    date.setDate(1);
    date.setMonth(date.getMonth() + monthOffset);
    return date
  }, [monthOffset, selectedDay]);

  const lastDate = useMemo<Date>(() => {
    const date = new Date(firstDate);
    date.setMonth(date.getMonth() + monthOffset + 1);
    date.setDate(date.getDate() - 1);
    return date
  }, [monthOffset, firstDate]);

  const monthNum = useMemo(
    () => firstDate.getMonth() as CalendarMonth,
    [firstDate]
  );

  const datesBeforeFirstDate = useMemo(() => {
    const dates: Date[] = [];
    const weekDay = firstDate.getDate();
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
    const weekDate = lastDate.getDate();
    for (let i = 1; i < 7 - weekDate; i++) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [lastDate]);

  const isFirstMonth = useMemo(() => {
    const day = getDayFromDate(firstDate);
    return day && min && day <= min;
  }, [min, firstDate]);

  const isLastMonth = useMemo(() => {
    const day = getDayFromDate(lastDate);
    return day && max && day >= max;
  }, [max, lastDate]);

  const dateCells = useMemo(() => {
    return [
      ...datesBeforeFirstDate.map((date) => ({
        date,
        isDateOfCurrentMonth: false,
      })),
      ...datesOfMonth.map((date) => ({date, isDateOfCurrentMonth: true})),
      ...datesAfterLastDate.map((date) => ({
        date,
        isDateOfCurrentMonth: false,
      })),
    ]
      .map(({date, ...rest}) => ({
        day: getDayFromDate(date),
        date,
        ...rest,
      }))
      .map(({day, ...rest}) => ({
        selected: day === selectedDay,
        isSelectable:
          day !== selectedDay &&
          (min && day ? day >= min : true) &&
          (max && day ? day <= max : true),
        day,
        ...rest,
      }))
      .map(({date, day, isDateOfCurrentMonth, isSelectable, selected}) => ({
        className: [
          "text-center select-none",
          selected
            ? "bg-primary-400 text-white"
            : isSelectable
              ? [
                isDateOfCurrentMonth ? "text-mono-600" : "text-mono-400",
                "hover:bg-primary-100",
              ].join(" ")
              : "text-mono-200",
        ].join(" "),
        onClick:
          day && isSelectable
            ? () => {
              setSelectedDay?.(day);
              setMonthOffset(0);
            }
            : undefined,
        num: date.getDate(),
      }));
  }, [
    datesBeforeFirstDate,
    datesOfMonth,
    datesAfterLastDate,
    min,
    max,
    selectedDay,
    setSelectedDay,
    setMonthOffset,
  ]);

  const leftCaretClassName = useMemo(
    () => ["text-sm", isFirstMonth ? "neutral" : ""].join(" "),
    [isFirstMonth]
  );

  const rightCaretClassName = useMemo(
    () => ["text-sm", isLastMonth ? "neutral" : ""].join(" "),
    [isLastMonth]
  );

  const onClickPrevious = useCallback(() => {
    setMonthOffset((n) => n - 1);
  }, [setMonthOffset]);

  const onClickNext = useCallback(() => {
    setMonthOffset((n) => n + 1);
  }, [setMonthOffset]);

  return (
    <div className="flex flex-col w-64 gap-1">
      <div className="flex flex-row justify-between py-1 my-1 border-b border-mono-300">
        <div className="flex flex-row items-center gap-2">
          <span className={leftCaretClassName}>
            <Icon
              name="caret-left"
              onClick={isFirstMonth ? undefined : onClickPrevious}
            />
          </span>
          <span className="font-medium">{monthName[monthNum]}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <span className="font-medium">{firstDate.getFullYear()}</span>
          <span className={rightCaretClassName}>
            <Icon
              name="caret-right"
              onClick={isLastMonth ? undefined : onClickNext}
            />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {calendarWeekDays.map((n) => (
          <div key={n} className="text-center select-none">
            {weekDayName[n]}
          </div>
        ))}
        {dateCells.map(({num, className, onClick}, i) => (
          <div key={i} className={className} onClick={onClick}>
            {num}
          </div>
        ))}
        {
          /* Avoid layout shifting: in case there are 5 rows, fill with an empty row. */
          dateCells.length === 35
            ? Array.from({length: 7}).map((_, i) => <div key={i}>&nbsp;</div>)
            : null
        }
      </div>
    </div>
  );
};

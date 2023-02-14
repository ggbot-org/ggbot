import { Calendar, CalendarProps, CalendarSetSelectedDay } from "@ggbot2/design";
import { Day } from "@ggbot2/time";
import { FC } from "react";

type Props = {
  startDay?: Day;
  endDay?: Day;
  setStartDay?: CalendarSetSelectedDay;
  setEndDay?: CalendarSetSelectedDay;
} & Pick<CalendarProps, "min" | "max">;

export const DailyIntervalSelector: FC<Props> = ({
  max,
  min,
  endDay,
  setEndDay,
  startDay,
  setStartDay,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Calendar min={min} max={endDay} selectedDay={startDay} setSelectedDay={setStartDay} />
      <Calendar min={startDay} max={max} selectedDay={endDay} setSelectedDay={setEndDay} />
    </div>
  );
};

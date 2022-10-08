import {
  Calendar,
  CalendarProps,
  CalendarSetSelectedDay,
} from "@ggbot2/ui-components";
import { Day } from "@ggbot2/time";
import { FC } from "react";

export type DailyIntervalSelectorProps = {
  startDay: Day;
  setStartDay: CalendarSetSelectedDay;
} & Pick<CalendarProps, "min" | "max">;

export const DailyIntervalSelector: FC<DailyIntervalSelectorProps> = ({
  max,
  startDay,
  setStartDay,
}) => {
  return (
    <div>
      <Calendar max={max} selectedDay={startDay} setSelectedDay={setStartDay} />
    </div>
  );
};

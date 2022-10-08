import { Calendar, CalendarSetSelectedDay } from "@ggbot2/ui-components";
import { Day } from "@ggbot2/time";
import { FC } from "react";

export type DailyIntervalSelectorProps = {
  startDay: Day;
  setStartDay: CalendarSetSelectedDay;
};

export const DailyIntervalSelector: FC<DailyIntervalSelectorProps> = ({
  startDay,
  setStartDay,
}) => {
  return (
    <div>
      <Calendar selectedDay={startDay} setSelectedDay={setStartDay} />
    </div>
  );
};

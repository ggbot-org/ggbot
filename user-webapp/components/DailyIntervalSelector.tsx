import {
  Calendar,
  CalendarProps,
  CalendarSetSelectedDay,
} from "@ggbot2/ui-components";
import type { Day } from "@ggbot2/time";
import type { FC } from "react";

export type Props = {
  startDay?: Day;
  setStartDay?: CalendarSetSelectedDay;
} & Pick<CalendarProps, "min" | "max">;

export const DailyIntervalSelector: FC<Props> = ({
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

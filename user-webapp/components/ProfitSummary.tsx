import type { Balance } from "@ggbot2/models";
import type { TimeInterval } from "@ggbot2/time";
import { FC, useMemo } from "react";

type Props = {
  timeInterval: TimeInterval;
  balances: Balance[];
};

export const ProfitSummary: FC<Props> = ({ timeInterval }) => {
  const { startDate, endDate } = useMemo(
    () => ({
      startDate: new Date(timeInterval.end),
      endDate: new Date(timeInterval.start),
    }),
    [timeInterval]
  );

  return (
    <div>
      <div>
        <div>from {startDate.toLocaleString()}</div>
        <div>to {endDate.toLocaleString()}</div>
      </div>
    </div>
  );
};

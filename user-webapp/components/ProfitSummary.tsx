import type { Balance } from "@ggbot2/models";
import type { TimeInterval } from "@ggbot2/time";
import { DateTime } from "@ggbot2/ui-components";
import { FC } from "react";

type Props = {
  timeInterval: TimeInterval;
  balances: Balance[];
};

export const ProfitSummary: FC<Props> = ({ timeInterval }) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex gap-2">
          <span>from</span>
          <DateTime format="day" value={timeInterval.start} />
        </div>

        <div className="flex gap-2">
          <span>to</span>
          <DateTime format="day" value={timeInterval.end} />
        </div>
      </div>
    </div>
  );
};

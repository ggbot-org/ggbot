import { Calendar } from "@ggbot2/ui-components";
import { Day } from "@ggbot2/time";
import { FC } from "react";

type Props = { isBacktesting: boolean };

export const DailyIntervalSelector: FC<Props> = ({}) => {
  return (
    <div>
      <Calendar />
    </div>
  );
};

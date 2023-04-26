import { today } from "@ggbot2/time";
import { DailyInterval } from "@ggbot2/design";
import { FC, useState } from "react";

export const TimeIntervalSelectors: FC = () => {
  const labelStart = "From";
  const labelEnd = "To";
  const max = today();
  const [start, setStart] = useState(max);
  const [end, setEnd] = useState(max);

  return (
    <DailyInterval
      start={start}
      end={end}
      labelStart={labelStart}
      labelEnd={labelEnd}
      max={max}
      setStart={setStart}
      setEnd={setEnd}
    />
  );
};

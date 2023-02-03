import { AccountStrategy } from "@ggbot2/models";
import { FC, useMemo } from "react";
import { SchedulingStatusBadge } from "./SchedulingStatusBadge";

type Props = {
  schedulings: AccountStrategy["schedulings"] | undefined;
};

export const SchedulingsStatusBadges: FC<Props> = ({ schedulings }) => {
  const { numActive, numInactive, numSuspended } = useMemo(() => {
    let numActive = 0;
    let numInactive = 0;
    let numSuspended = 0;
    if (!schedulings) return { numActive, numInactive, numSuspended, numSchedulings: 0 };
    for (const scheduling of schedulings) {
      if (scheduling.status === "active") numActive++;
      if (scheduling.status === "inactive") numInactive++;
      if (scheduling.status === "suspended") numSuspended++;
    }
    return { numActive, numInactive, numSuspended };
  }, [schedulings]);

  return (
    <div className="flex flex-row gap-2">
      <SchedulingStatusBadge schedulingStatus="suspended" count={numSuspended} />

      <SchedulingStatusBadge schedulingStatus="inactive" count={numInactive} />

      <SchedulingStatusBadge schedulingStatus="active" count={numActive} />
    </div>
  );
};

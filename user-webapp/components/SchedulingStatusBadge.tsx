import { StrategySchedulingStatus } from "@ggbot2/models";
import { FC, useMemo } from "react";

type Props = {
  schedulingStatus: StrategySchedulingStatus;
};

export const SchedulingStatusBadge: FC<Props> = ({ schedulingStatus }) => {
  const label = useMemo(() => {
    const schedulingStatusLabel: Record<StrategySchedulingStatus, string> = {
      active: "active",
      inactive: "inactive",
      suspended: "suspended",
    };
    return schedulingStatusLabel[schedulingStatus];
  }, [schedulingStatus]);

  const className = useMemo(() => {
    const schedulingStatusClassName: Record<StrategySchedulingStatus, string> =
      {
        active: "bg-primary-100",
        inactive: "bg-mono-100",
        suspended: "bg-danger-100",
      };
    return [
      "px-2 py-1 select-none rounded-md",
      schedulingStatusClassName[schedulingStatus],
    ].join(" ");
  }, [schedulingStatus]);

  return <div className={className}>{label}</div>;
};

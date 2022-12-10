import type { AccountStrategy, StrategyScheduling } from "@ggbot2/models";
import { FC, useMemo } from "react";

type Props = {
  schedulings: AccountStrategy["schedulings"];
};

export const SchedulingStatusBadge: FC<Props> = ({ schedulings }) => {
  const schedulingStatus = useMemo<StrategyScheduling["status"]>(() => {
    if (schedulings.length === 0) return "inactive";
    if (schedulings.some((scheduling) => scheduling.status === "suspended"))
      return "suspended";
    if (schedulings.every((scheduling) => scheduling.status === "active"))
      return "active";
    return "inactive";
  }, [schedulings]);

  const label = useMemo(() => {
    const schedulingStatusLabel: Record<StrategyScheduling["status"], string> =
      {
        active: "active",
        inactive: "inactive",
        suspended: "suspended",
      };
    return schedulingStatusLabel[schedulingStatus];
  }, [schedulingStatus]);

  const className = useMemo(() => {
    const schedulingStatusClassName: Record<
      StrategyScheduling["status"],
      string
    > = {
      active: "bg-cyan-100 dark:bg-cyan-200 text-cyan-800",
      inactive:
        "bg-neutral-100 text-neutral-500 dark:bg-neutral-500 dark:text-neutral-800",
      suspended: "bg-yellow-300 text-yellow-800",
    };
    return [
      "px-2 py-1 select-none rounded-md",
      schedulingStatusClassName[schedulingStatus],
    ].join(" ");
  }, [schedulingStatus]);

  return <div className={className}>{label}</div>;
};

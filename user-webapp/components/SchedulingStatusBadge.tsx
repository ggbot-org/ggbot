import { Pill, PillProps } from "@ggbot2/ui-components";
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

  const color = useMemo<PillProps["color"]>(() => {
    const schedulingStatusColor: Record<
      StrategyScheduling["status"],
      PillProps["color"]
    > = {
      active: "primary",
      inactive: "neutral",
      suspended: "danger",
    };
    return schedulingStatusColor[schedulingStatus];
  }, [schedulingStatus]);

  return <Pill color={color}>{label}</Pill>;
};

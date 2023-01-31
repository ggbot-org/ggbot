import { Pill, PillProps } from "@ggbot2/ui-components";
import { AccountStrategy, StrategyScheduling } from "@ggbot2/models";
import { FC, ReactNode, useMemo } from "react";

type Props = {
  schedulings?: AccountStrategy["schedulings"];
};

const schedulingStatusColor: Record<
  StrategyScheduling["status"],
  PillProps["color"]
> = {
  active: "primary",
  inactive: "neutral",
  suspended: "danger",
};

const schedulingStatusLabel: Record<StrategyScheduling["status"], string> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
};

export const SchedulingsStatusBadge: FC<Props> = ({ schedulings }) => {
  const schedulingStatus = useMemo<
    StrategyScheduling["status"] | undefined
  >(() => {
    if (!schedulings) return;
    if (schedulings.length === 0) return "inactive";
    if (schedulings.some((scheduling) => scheduling.status === "suspended"))
      return "suspended";
    if (schedulings.every((scheduling) => scheduling.status === "active"))
      return "active";
    return "inactive";
  }, [schedulings]);

  const { color, label } = useMemo<{
    color: PillProps["color"];
    label: ReactNode;
  }>(() => {
    if (!schedulingStatus)
      return {
        color: "neutral",
        label: <>&npsp;</>,
      };
    return {
      label: schedulingStatusLabel[schedulingStatus],
      color: schedulingStatusColor[schedulingStatus],
    };
  }, [schedulingStatus]);

  return <Pill color={color}>{label}</Pill>;
};

import { Pill, PillProps } from "@ggbot2/ui-components";
import { AccountStrategy, StrategyScheduling } from "@ggbot2/models";
import { FC, ReactNode, useMemo } from "react";

type Props = {
  schedulings: AccountStrategy["schedulings"] | undefined;
};

const schedulingStatusColor: Record<StrategyScheduling["status"], PillProps["color"]> = {
  active: "primary",
  inactive: "neutral",
  suspended: "danger",
};

const schedulingStatusLabel: Record<StrategyScheduling["status"], string> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
};

// TODO show
//    "active 2/3"
//    "inactive"
//    "active" if 1/1
//    implement this TODO and turn it into docs
export const SchedulingsStatusBadge: FC<Props> = ({ schedulings }) => {
  const { schedulingStatus, numActive, numSchedulings } = useMemo<{
    schedulingStatus: StrategyScheduling["status"] | undefined;
    numSchedulings: number | undefined;
    numActive: number | undefined;
  }>(() => {
    if (!schedulings) {
      return { schedulingStatus: undefined, numSchedulings: undefined, numActive: undefined };
    }
    const numSchedulings = schedulings.length;
    const numActive = schedulings.filter(({ status }) => status === "active").length;
    if (numSchedulings === 0) {
      return { schedulingStatus: "inactive", numSchedulings, numActive };
    }
    if (schedulings.some(({ status }) => status === "suspended")) {
      return { schedulingStatus: "suspended", numSchedulings, numActive };
    }
    if (schedulings.every(({ status }) => status === "active")) {
      return { schedulingStatus: "active", numSchedulings, numActive };
    }
    return { schedulingStatus: "inactive", numSchedulings, numActive };
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
    const statusLabel = schedulingStatusLabel[schedulingStatus];
    const color = schedulingStatusColor[schedulingStatus];
    if (status === "active") {
      const label = numSchedulings === 1 ? statusLabel : `${statusLabel} ${numActive}/${numSchedulings}`;
      return { label, color };
    }
    return { label: statusLabel, color };
  }, [schedulingStatus]);

  return <Pill color={color}>{label}</Pill>;
};

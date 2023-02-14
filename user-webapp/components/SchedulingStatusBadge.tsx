import { SchedulingStatus } from "@ggbot2/models";
import { Color, Pill } from "@ggbot2/design";
import { FC, ReactNode, useMemo } from "react";

type Props = {
  schedulingStatus: SchedulingStatus | undefined;
  count?: number;
};

const schedulingStatusColor: Record<SchedulingStatus, Color> = {
  active: "primary",
  inactive: "neutral",
  suspended: "danger",
};

const schedulingStatusLabel: Record<SchedulingStatus, string> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
};

export const SchedulingStatusBadge: FC<Props> = ({ schedulingStatus, count }) => {
  const { color, label } = useMemo<{
    color: Color;
    label: ReactNode;
  }>(() => {
    if (!schedulingStatus)
      return {
        color: "neutral",
        label: <>&npsp;</>,
      };
    const label = schedulingStatusLabel[schedulingStatus];
    const color = schedulingStatusColor[schedulingStatus];
    return { label, color };
  }, [schedulingStatus]);

  if (count === undefined)
    return (
      <div>
        <Pill color={color}>{label}</Pill>
      </div>
    );

  if (count === 0) return null;

  return (
    <div>
      <Pill color={color}>{label}</Pill>
      <Pill color={color}>{count}</Pill>
    </div>
  );
};

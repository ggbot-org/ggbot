import { SchedulingStatus } from "@ggbot2/models";
import { Tags, Tag, TagProps } from "@ggbot2/design";
import { FC, ReactNode, useMemo } from "react";

type Props = {
  schedulingStatus: SchedulingStatus | undefined;
  count?: number;
};

type SchedulingStatusBadgeColor = Extract<TagProps["color"], "primary" | "danger" | "white">;

const schedulingStatusColor: Record<SchedulingStatus, SchedulingStatusBadgeColor> = {
  active: "primary",
  inactive: "white",
  suspended: "danger",
};

const schedulingStatusLabel: Record<SchedulingStatus, string> = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
};

export const SchedulingStatusBadge: FC<Props> = ({ schedulingStatus, count }) => {
  const { color, label } = useMemo<{
    color: SchedulingStatusBadgeColor;
    label: ReactNode;
  }>(() => {
    if (!schedulingStatus)
      return {
        color: "white",
        label: <>&npsp;</>,
      };
    const label = schedulingStatusLabel[schedulingStatus];
    const color = schedulingStatusColor[schedulingStatus];
    return { label, color };
  }, [schedulingStatus]);

  if (count === undefined) return <Tag color={color}>{label}</Tag>;

  if (count === 0) return null;

  return (
    <Tags hasAddons>
      <Tag color={color}>{label}</Tag>
      <Tag color={color}>{count}</Tag>
    </Tags>
  );
};

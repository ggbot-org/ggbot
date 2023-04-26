import { SchedulingStatus } from "@ggbot2/models";
import { Tags, Tag, TagProps } from "@ggbot2/design";
import { FC, ReactNode, useMemo } from "react";
import { schedulingStatusLabel } from "_i18n";

type Props = {
  schedulingStatus: SchedulingStatus | undefined;
  count?: number;
};

type SchedulingStatusBadgeColor = Extract<
  TagProps["color"],
  "primary" | "danger" | "light"
>;

const schedulingStatusColor: Record<
  SchedulingStatus,
  SchedulingStatusBadgeColor
> = {
  active: "primary",
  inactive: "light",
  suspended: "danger",
};

export const SchedulingStatusBadge: FC<Props> = ({
  schedulingStatus,
  count,
}) => {
  const { color, label } = useMemo<{
    color: SchedulingStatusBadgeColor;
    label: ReactNode;
  }>(() => {
    if (!schedulingStatus)
      return {
        color: "light",
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

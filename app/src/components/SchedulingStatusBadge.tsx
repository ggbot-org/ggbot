import { schedulingStatusLabel } from "_i18n";
import { Tag, TagProps, Tags } from "@ggbot2/design";
import { SchedulingStatus } from "@ggbot2/models";
import { FC, ReactNode } from "react";

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
  let color: SchedulingStatusBadgeColor = "light";
  let label: ReactNode = <>&npsp;</>;

  if (schedulingStatus) {
    label = schedulingStatusLabel[schedulingStatus];
    color = schedulingStatusColor[schedulingStatus];
  }

  if (count === undefined) return <Tag color={color}>{label}</Tag>;

  if (count === 0) return null;

  return (
    <Tags hasAddons>
      <Tag color={color}>{label}</Tag>
      <Tag color={color}>{count}</Tag>
    </Tags>
  );
};

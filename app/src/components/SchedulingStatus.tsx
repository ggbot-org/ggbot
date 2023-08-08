import { Tag, TagProps, Tags } from "@ggbot2/design";
import { SchedulingStatus as Status } from "@ggbot2/models";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";

type Props = {
  status: Status | undefined;
  count?: number;
};

type SchedulingStatusColor = Extract<
  TagProps["color"],
  "primary" | "danger" | "light"
>;

const colorOf: Record<Status, SchedulingStatusColor> = {
  active: "primary",
  inactive: "light",
  suspended: "danger",
};

export const SchedulingStatus: FC<Props> = ({ status, count }) => {
  const { formatMessage } = useIntl();

  let color: SchedulingStatusColor | undefined;
  let label: ReactNode = "";

  if (status) {
    color = colorOf[status];
    label = formatMessage({ id: `SchedulingStatus.${status}` });
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

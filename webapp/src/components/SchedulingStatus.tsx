import { classNames } from "_/classNames"
import { Tag, TagProps, Tags } from "_/components/library"
import { SchedulingStatus as Status } from "@workspace/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type SchedulingStatusColor = Extract<
	TagProps["color"],
	"primary" | "danger" | "light"
>

const colorOf: Record<Status, SchedulingStatusColor> = {
	active: "primary",
	inactive: "light",
	suspended: "danger"
}

type _TagLabelProps = {
	status: Status | undefined
}

const _TagLabel: FC<_TagLabelProps> = ({ status }) => {
	const { formatMessage } = useIntl()

	if (!status) return null

	return (
		<Tag className={classNames("is-uppercase")} color={colorOf[status]}>
			{formatMessage({ id: `SchedulingStatus.${status}` })}
		</Tag>
	)
}

type SchedulingStatusProps = Pick<_TagLabelProps, "status"> & {
	count?: number
}

export const SchedulingStatus: FC<SchedulingStatusProps> = ({
	status,
	count
}) => {
	if (count === undefined) return <_TagLabel status={status} />

	if (count === 0) return null

	return (
		<Tags hasAddons>
			<_TagLabel status={status} />

			<Tag color={status ? colorOf[status] : undefined}>{count}</Tag>
		</Tags>
	)
}

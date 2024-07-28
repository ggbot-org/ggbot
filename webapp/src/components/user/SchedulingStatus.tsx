import { classnames } from "_/classnames"
import { Tag, TagProps, Tags } from "_/components/library"
import { SchedulingStatus as Status } from "@workspace/models"
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

function _TagLabel({ status }: _TagLabelProps) {
	const { formatMessage } = useIntl()

	if (!status) return null

	return (
		<Tag className={classnames("is-uppercase")} color={colorOf[status]}>
			{formatMessage({ id: `SchedulingStatus.${status}` })}
		</Tag>
	)
}

type SchedulingStatusProps = Pick<_TagLabelProps, "status"> & {
	count?: number
}

export function SchedulingStatus({ status, count }: SchedulingStatusProps) {
	if (count === undefined) return <_TagLabel status={status} />

	if (count === 0) return null

	return (
		<Tags hasAddons>
			<_TagLabel status={status} />

			<Tag color={status ? colorOf[status] : undefined}>{count}</Tag>
		</Tags>
	)
}

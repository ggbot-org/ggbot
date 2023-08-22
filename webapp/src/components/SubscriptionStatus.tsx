import { Tag, TagProps } from "@ggbot2/design"
import { SubscriptionStatus as Status } from "@ggbot2/models"
import { FC, ReactNode } from "react"
import { useIntl } from "react-intl"

type Props = {
	status: Status | undefined
}

type SubscriptionStatusColor = Extract<TagProps["color"], "primary" | "warning">

const colorOf: Record<Status, SubscriptionStatusColor> = {
	active: "primary",
	expired: "warning"
}

export const SubscriptionStatus: FC<Props> = ({ status }) => {
	const { formatMessage } = useIntl()

	let color: SubscriptionStatusColor | undefined
	let label: ReactNode = ""

	if (status) {
		color = colorOf[status]
		label = formatMessage({ id: `SubscriptionStatus.${status}` })
	}

	return <Tag color={color}>{label}</Tag>
}

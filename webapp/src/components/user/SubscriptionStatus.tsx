import { MainColor, Tag } from "_/components/library"
import { SubscriptionStatus as Status } from "@workspace/models"
import { useIntl } from "react-intl"

type Props = {
	status: Status | undefined
}

type SubscriptionStatusColor = Extract<MainColor, "primary" | "warning">

const colorOf: Record<Status, SubscriptionStatusColor> = {
	active: "primary",
	expired: "warning"
}

export function SubscriptionStatus({ status }: Props) {
	const { formatMessage } = useIntl()

	let color: SubscriptionStatusColor | undefined
	let label = ""

	if (status) {
		color = colorOf[status]
		label = formatMessage({ id: `SubscriptionStatus.${status}` })
	}

	return <Tag color={color}>{label}</Tag>
}

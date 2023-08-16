import { Message } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const SubscriptionPurchased: FC = () => (
	<Message color="success">
		<FormattedMessage id="SubscriptionPurchased.message" />
	</Message>
)

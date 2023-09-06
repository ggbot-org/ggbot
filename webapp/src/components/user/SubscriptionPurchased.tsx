import { Message } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const SubscriptionPurchased: FC = () => (
	<Message color="success">
		<FormattedMessage id="SubscriptionPurchased.message" />
	</Message>
)

import { Message } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const PurchaseCanceled: FC = () => (
	<Message color="warning">
		<FormattedMessage id="PurchaseCanceled.message" />
	</Message>
)

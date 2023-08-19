import { Message } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const PurchaseCanceled: FC = () => (
	<Message color="warning">
		<FormattedMessage id="PurchaseCanceled.message" />
	</Message>
)

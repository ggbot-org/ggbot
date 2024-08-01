import { Message } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function PurchaseCanceled() {
	return (
		<Message color="warning">
			<FormattedMessage id="PurchaseCanceled.message" />
		</Message>
	)
}

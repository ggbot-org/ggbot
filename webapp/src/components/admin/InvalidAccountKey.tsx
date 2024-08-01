import { Message } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function InvalidAccountKey() {
	return (
		<Message color="info">
			<FormattedMessage id="InvalidAccountKey.message" />
		</Message>
	)
}

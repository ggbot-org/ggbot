import { Message } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function TimeoutError() {
	return (
		<Message color="warning">
			<FormattedMessage id="TimeoutError.message" />
		</Message>
	)
}

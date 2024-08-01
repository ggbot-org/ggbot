import { Message } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function GenericError() {
	return (
		<Message color="warning">
			<FormattedMessage id="GenericError.message" />
		</Message>
	)
}

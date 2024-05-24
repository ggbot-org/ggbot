import { Message } from "_/components/library"
import { FormattedMessage } from "react-intl"

export function InvalidStrategyKey() {
	return (
		<Message color="info">
			<FormattedMessage id="InvalidStrategyKey.message" />
		</Message>
	)
}

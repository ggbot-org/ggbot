import { Message } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'

// TODO use a toast instead
export function TimeoutError() {
	return (
		<Message color="warning">
			<FormattedMessage id="TimeoutError.message" />
		</Message>
	)
}

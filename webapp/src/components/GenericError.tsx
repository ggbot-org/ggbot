import { Message } from '_/components/library'
import { FormattedMessage } from '_/i18n/components'

// TODO use a toast instead
export function GenericError() {
	return (
		<Message color="warning">
			<FormattedMessage id="GenericError.message" />
		</Message>
	)
}

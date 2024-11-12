import { Message } from '_/components/library'
import { FormattedMessage } from 'react-intl'

// TODO use a toast instead
export function TimeoutError() {
	return (
		<Message color="warning">
			<FormattedMessage id="TimeoutError.message" />
		</Message>
	)
}

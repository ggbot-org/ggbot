import { Message } from '_/components/library'
import { FormattedMessage } from 'react-intl'

// TODO use a toast instead
export function GenericError() {
	return (
		<Message color="warning">
			<FormattedMessage id="GenericError.message" />
		</Message>
	)
}

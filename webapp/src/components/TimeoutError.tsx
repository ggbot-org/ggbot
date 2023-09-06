import { Message } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const TimeoutError: FC = () => (
	<Message color="warning">
		<FormattedMessage id="TimeoutError.message" />
	</Message>
)

import { Message } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const GenericError: FC = () => (
	<Message color="warning">
		<FormattedMessage id="GenericError.message" />
	</Message>
)

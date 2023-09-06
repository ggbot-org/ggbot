import { Message } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const InvalidAccountKey: FC = () => (
	<Message color="info">
		<FormattedMessage id="InvalidAccountKey.message" />
	</Message>
)

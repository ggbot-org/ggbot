import { Message } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const InvalidAccountKey: FC = () => (
	<Message color="info">
		<FormattedMessage id="InvalidAccountKey.message" />
	</Message>
)

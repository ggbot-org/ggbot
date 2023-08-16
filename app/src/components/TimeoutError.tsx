import { Message } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const TimeoutError: FC = () => (
	<Message color="warning">
		<FormattedMessage id="TimeoutError.message" />
	</Message>
)

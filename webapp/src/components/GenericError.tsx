import { Message } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const GenericError: FC = () => (
	<Message color="warning">
		<FormattedMessage id="GenericError.message" />
	</Message>
)

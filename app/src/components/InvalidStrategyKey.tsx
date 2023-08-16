import { Message } from "@ggbot2/design"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const InvalidStrategyKey: FC = () => (
	<Message color="info">
		<FormattedMessage id="InvalidStrategyKey.message" />
	</Message>
)

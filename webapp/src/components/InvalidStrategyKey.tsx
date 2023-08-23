import { Message } from "_/components/library"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const InvalidStrategyKey: FC = () => (
	<Message color="info">
		<FormattedMessage id="InvalidStrategyKey.message" />
	</Message>
)

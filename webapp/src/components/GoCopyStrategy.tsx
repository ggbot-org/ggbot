import { Button } from "_/components/library"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
	strategyKey: StrategyKey | undefined
}

export const GoCopyStrategy: FC<Props> = ({ strategyKey }) => {
	const onClick = () => {
		if (!strategyKey) return
		GOTO(webapp.user.copyStrategy(strategyKey))
	}

	return (
		<Button onClick={onClick}>
			<FormattedMessage id="GoCopyStrategy.label" />
		</Button>
	)
}

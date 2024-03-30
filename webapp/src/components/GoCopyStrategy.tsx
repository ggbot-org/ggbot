import { Button } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const GoCopyStrategy: FC = () => {
	const { strategyKey } = useContext(StrategyContext)

	return (
		<Button
			onClick={() => {
				if (!strategyKey) return
				GOTO(webapp.user.copyStrategy(strategyKey))
			}}
		>
			<FormattedMessage id="GoCopyStrategy.label" />
		</Button>
	)
}

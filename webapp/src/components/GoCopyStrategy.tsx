import { Button } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { webapp } from "_/routing/webapp"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const GoCopyStrategy: FC = () => {
	const { strategyKey } = useContext(StrategyContext)

	if (!strategyKey) return null

	const strategyUrl = webapp.user.copyStrategy(strategyKey)

	return (
		<form
			method="GET"
			action={`${strategyUrl.pathname}${strategyUrl.search}`}
		>
			<Button>
				<FormattedMessage id="GoCopyStrategy.label" />
			</Button>
		</form>
	)
}

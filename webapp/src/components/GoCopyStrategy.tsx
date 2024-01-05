import { Button, ButtonOnClick } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { webapp } from "_/routing/webapp"
import { FC, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const GoCopyStrategy: FC = () => {
	const { strategyKey } = useContext(StrategyContext)

	const onClick = useCallback<ButtonOnClick>(
		(event) => {
			event.stopPropagation()
			if (!strategyKey) return
			window.location.href = webapp.user.copyStrategy(strategyKey).href
		},
		[strategyKey]
	)

	return (
		<Button onClick={onClick}>
			<FormattedMessage id="GoCopyStrategy.label" />
		</Button>
	)
}

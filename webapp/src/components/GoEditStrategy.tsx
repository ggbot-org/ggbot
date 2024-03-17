import { Button } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { webapp } from "_/routing/webapp"
import { FC, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const GoEditStrategy: FC = () => {
	const { strategyKey } = useContext(StrategyContext)

	const onClick = useCallback(() => {
		if (!strategyKey) return
		const url = webapp.user.editStrategy(strategyKey)
		// @ts-expect-error
		location = `${url.pathname}${url.search}`
	}, [strategyKey])

	if (!strategyKey) return null

	return (
		<Button onClick={onClick}>
			<FormattedMessage id="GoEditStrategy.label" />
		</Button>
	)
}

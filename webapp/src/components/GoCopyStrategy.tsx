import { Button, ButtonOnClick } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { href } from "_/routing/user/hrefs"
import { FC, useCallback, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const GoCopyStrategy: FC = () => {
	const { strategy } = useContext(StrategyContext)

	const onClick = useCallback<ButtonOnClick>(
		(event) => {
			event.stopPropagation()
			window.location.href = href.copyStrategyPage({
				strategyId: strategy.id,
				strategyKind: strategy.kind
			})
		},
		[strategy]
	)

	return (
		<Button onClick={onClick}>
			<FormattedMessage id="GoCopyStrategy.label" />
		</Button>
	)
}

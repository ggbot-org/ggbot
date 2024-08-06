import { Button } from "_/components/library"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

export function GoCopyStrategy({ strategyKey }: {
	strategyKey: StrategyKey | undefined
}) {
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

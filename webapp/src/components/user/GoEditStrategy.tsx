import { Button } from "_/components/library"
import { GOTO } from "_/routing/navigation"
import { webapp } from "_/routing/webapp"
import { StrategyKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

export function GoEditStrategy({ strategyKey }: {
	strategyKey: StrategyKey | undefined
}) {
	if (!strategyKey) return null
	return (
		<Button
			onClick={() => {
				if (!strategyKey) return
				GOTO(webapp.user.editStrategy(strategyKey))
			}}
		>
			<FormattedMessage id="GoEditStrategy.label" />
		</Button>
	)
}

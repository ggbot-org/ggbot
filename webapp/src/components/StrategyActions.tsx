import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { Buttons, Div, OneColumn, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord, StrategyRecordProps } from "_/components/StrategyRecord"
import { StrategyKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

export function StrategyActions({
	readStrategyIsPending, strategyKey, strategyName, strategyId, strategyWhenCreated
}: StrategyRecordProps & {
	readStrategyIsPending: boolean | undefined
	strategyKey: StrategyKey | undefined
}) {
	return (
		<OneColumn>
			<Div bulma={["box", { "is-skeleton": readStrategyIsPending }]}>
				<Title>
					<FormattedMessage id="StrategyActions.title" />
				</Title>
				<StrategyRecord strategyId={strategyId} strategyName={strategyName} strategyWhenCreated={strategyWhenCreated} />
				<Buttons>
					<GoCopyStrategy strategyKey={strategyKey} />
					<ShareStrategy strategyKey={strategyKey} strategyName={strategyName} />
				</Buttons>
			</Div>
		</OneColumn>
	)
}

import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { Buttons, Div, OneColumn, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord, StrategyRecordProps } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { GoEditStrategy } from "_/components/user/GoEditStrategy"
import { RenameStrategy, RenameStrategyProps } from "_/components/user/RenameStrategy"
import { StrategyKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

export function StrategyActions({
	readStrategyIsPending, resetStrategy, strategyKey, strategyName, strategyId, strategyWhenCreated
}: StrategyRecordProps & Pick<RenameStrategyProps, "resetStrategy"> & {
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
					<RenameStrategy resetStrategy={resetStrategy} strategyKey={strategyKey} strategyName={strategyName} />
					<GoCopyStrategy strategyKey={strategyKey} />
					<ShareStrategy strategyKey={strategyKey} strategyName={strategyName} />
					<GoEditStrategy strategyKey={strategyKey} />
					<DeleteStrategy strategyId={strategyId} strategyKey={strategyKey} strategyName={strategyName} strategyWhenCreated={strategyWhenCreated} />
				</Buttons>
			</Div>
		</OneColumn>
	)
}

import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { GoEditStrategy } from "_/components/GoEditStrategy"
import { Buttons, Columns, Div, OneColumn, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord, StrategyRecordProps } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy, RenameStrategyProps } from "_/components/user/RenameStrategy"
import { StrategyKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

export function StrategyActions({
	readOnly,
	readStrategyIsPending,
	resetStrategy,
	strategyKey,
	strategyName,
	strategyId,
	strategyWhenCreated
}: {
	readOnly: boolean
	readStrategyIsPending: boolean | undefined
	strategyKey: StrategyKey | undefined
} & StrategyRecordProps & Partial<Pick<RenameStrategyProps, "resetStrategy">>) {
	return (
		<Columns>
			<OneColumn>
				<Div bulma={["box", { "is-skeleton": readStrategyIsPending }]}>
					<Title>
						<FormattedMessage id="StrategyActions.title" />
					</Title>
					<StrategyRecord
						strategyId={strategyId}
						strategyName={strategyName}
						strategyWhenCreated={strategyWhenCreated}
					/>
					<Buttons>
						{resetStrategy ? (
							<RenameStrategy
								resetStrategy={resetStrategy}
								strategyKey={strategyKey}
								strategyName={strategyName}
							/>
						) : null}
						<GoCopyStrategy strategyKey={strategyKey} />
						<ShareStrategy
							strategyKey={strategyKey}
							strategyName={strategyName}
						/>
						{readOnly ? null : (
							<>
								<GoEditStrategy strategyKey={strategyKey} />
								<DeleteStrategy
									strategyId={strategyId}
									strategyKey={strategyKey}
									strategyName={strategyName}
									strategyWhenCreated={strategyWhenCreated}
								/>
							</>
						)}
					</Buttons>
				</Div>
			</OneColumn>
		</Columns>
	)
}

import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { GoEditStrategy } from "_/components/GoEditStrategy"
import { Buttons, Columns, Div, OneColumn, Title } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyRecord, StrategyRecordProps } from "_/components/StrategyRecord"
import { DeleteStrategy } from "_/components/user/DeleteStrategy"
import { RenameStrategy, RenameStrategyProps } from "_/components/user/RenameStrategy"
import { StrategyKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

type Props = {
	readOnly: boolean
	readStrategyIsPending: boolean | undefined
	strategyKey: StrategyKey | undefined
} & StrategyRecordProps & Partial<Pick<RenameStrategyProps, "resetStrategy">>

export function StrategyActions({
	readOnly,
	readStrategyIsPending,
	resetStrategy,
	strategyKey,
	strategyName,
	strategyId,
	strategyWhenCreated
}: Props) {
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
								strategyKey={strategyKey}
								strategyName={strategyName}
								resetStrategy={resetStrategy}
							/>
						): null}

						<GoCopyStrategy strategyKey={strategyKey} />

						<ShareStrategy
							strategyKey={strategyKey}
							strategyName={strategyName}
						/>

						{readOnly ? null : (
							<>
								<GoEditStrategy strategyKey={strategyKey} />

								<DeleteStrategy
									strategyKey={strategyKey}
									strategyId={strategyId}
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

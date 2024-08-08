import { Column, Columns } from "_/components/library"
import { StrategyId, StrategyName, WhenCreated } from "_/components/readonlyFields"
import { Time } from "minimal-time-helpers"

export type StrategyRecordProps = {
	strategyId: string
	strategyName: string
	strategyWhenCreated: Time | undefined
}

export function StrategyRecord({
	strategyId, strategyName, strategyWhenCreated
}: StrategyRecordProps) {
	return (
		<>
			<Columns>
				<Column>
					<StrategyName value={strategyName} />
				</Column>
			</Columns>
			<Columns>
				<Column>
					<StrategyId value={strategyId} />
				</Column>
				<Column>
					<WhenCreated value={strategyWhenCreated} />
				</Column>
			</Columns>
		</>
	)
}

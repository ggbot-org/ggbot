import { Column, Columns } from "_/components/library"
import { StrategyId } from "_/components/StrategyId"
import { StrategyName } from "_/components/StrategyName"
import { WhenCreated } from "_/components/WhenCreated"
import { useStrategy } from "_/hooks/useStrategy"
import { StrategyKey } from "@workspace/models"

type Props = {
	strategyKey: StrategyKey | undefined
}

export function StrategyRecord({ strategyKey }: Props) {
	const { strategy, strategyName } = useStrategy(strategyKey)

	return (
		<>
			<Columns>
				<Column>
					<StrategyName isStatic value={strategyName} />
				</Column>
			</Columns>

			<Columns>
				<Column>
					<StrategyId value={strategy?.id} />
				</Column>

				<Column>
					<WhenCreated value={strategy?.whenCreated} />
				</Column>
			</Columns>
		</>
	)
}

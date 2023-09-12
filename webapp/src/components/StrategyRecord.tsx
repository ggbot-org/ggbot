import { Column, Columns } from "_/components/library"
import { StrategyId } from "_/components/StrategyId.js"
import { StrategyName } from "_/components/StrategyName.js"
import { WhenCreated } from "_/components/WhenCreated.js"
import { StrategyContext } from "_/contexts/Strategy.js"
import { FC, useContext } from "react"

export const StrategyRecord: FC = () => {
	const { strategy } = useContext(StrategyContext)

	return (
		<>
			<Columns>
				<Column>
					<StrategyName isStatic value={strategy.name} />
				</Column>
			</Columns>

			<Columns>
				<Column>
					<StrategyId value={strategy.id} />
				</Column>

				<Column>
					<WhenCreated value={strategy.whenCreated} />
				</Column>
			</Columns>
		</>
	)
}

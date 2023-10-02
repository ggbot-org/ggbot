import { Column, Columns } from "_/components/library"
import { StrategyId } from "_/components/StrategyId"
import { StrategyName } from "_/components/StrategyName"
import { WhenCreated } from "_/components/WhenCreated"
import { StrategyContext } from "_/contexts/Strategy"
import { FC, useContext } from "react"

export const StrategyRecord: FC = () => {
	const { strategy } = useContext(StrategyContext)

	return (
		<>
			<Columns>
				<Column>
					<StrategyName isStatic value={strategy?.name ?? ""} />
				</Column>
			</Columns>

			<Columns>
				<Column>
					<StrategyId value={strategy?.id ?? ""} />
				</Column>

				<Column>
					<WhenCreated value={strategy?.whenCreated ?? 0} />
				</Column>
			</Columns>
		</>
	)
}

import { Column, Columns } from "_/components/library"
import { StrategyId } from "_/components/StrategyId.js"
import { StrategyName } from "_/components/StrategyName.js"
import { WhenCreated } from "_/components/WhenCreated.js"
import { Strategy } from "@ggbot2/models"
import { FC } from "react"

type Props = { strategy: Strategy }

export const StrategyRecord: FC<Props> = ({ strategy }) => (
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

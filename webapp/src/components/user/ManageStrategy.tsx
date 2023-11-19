import { Column, Columns } from "_/components/library"
import { StrategyProfits } from "_/components/StrategyProfits"
import { Schedulings } from "_/components/user/Schedulings"
import { StrategyActions } from "_/components/user/StrategyActions"
import { FC } from "react"

export const ManageStrategy: FC = () => (
	<Columns isMultiline>
		<Column
			size={{
				tablet: "full",
				desktop: "one-third",
				fullhd: "two-fifths"
			}}
		>
			<StrategyActions />
		</Column>

		<Column
			size={{
				tablet: "full",
				desktop: "two-thirds",
				fullhd: "three-fifths"
			}}
		>
			<StrategyProfits numDays={30} />
		</Column>

		<Column>
			<Schedulings />
		</Column>
	</Columns>
)

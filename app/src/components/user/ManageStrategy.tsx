import { Column, Columns } from "@ggbot2/design"
import { FC } from "react"

import { Schedulings } from "../Schedulings.js"
import { StrategyProfits } from "../StrategyProfits.js"
import { StrategyActions } from "./StrategyActions.js"

export const ManageStrategy: FC = () => (
	<Columns isMultiline isVcentered>
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

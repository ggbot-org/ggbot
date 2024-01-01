import { Columns, OneColumn } from "_/components/library"
import { Schedulings } from "_/components/user/Schedulings"
import { StrategyActions } from "_/components/user/StrategyActions"
import { FC } from "react"

export const ManageStrategy: FC = () => (
	<>
		<Columns>
			<OneColumn>
				<StrategyActions />
			</OneColumn>
		</Columns>

		<Schedulings />
	</>
)

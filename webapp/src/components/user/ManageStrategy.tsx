import { Schedulings } from "_/components/user/Schedulings"
import { StrategyActions } from "_/components/user/StrategyActions"
import { FC } from "react"

export const ManageStrategy: FC = () => (
	<>
		<StrategyActions />

		<Schedulings />
	</>
)

import { StrategyActions } from "_/components/StrategyActions"
import { Schedulings } from "_/components/user/Schedulings"
import { FC } from "react"

export const ManageStrategy: FC = () => (
	<>
		<StrategyActions readOnly={false} />

		<Schedulings />
	</>
)

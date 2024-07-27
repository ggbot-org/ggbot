import { StrategyActions } from "_/components/StrategyActions"
import { Schedulings } from "_/components/user/Schedulings"

export function ManageStrategy() {
	return (
		<>
			<StrategyActions readOnly={false} />

			<Schedulings />
		</>
	)
}

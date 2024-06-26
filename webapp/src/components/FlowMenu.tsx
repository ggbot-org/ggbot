import { classNames } from "_/classNames"
import { Input } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { PropsWithChildren, useContext } from "react"

export function FlowMenu({ children }: PropsWithChildren) {
	const { strategyName } = useContext(StrategyContext)

	return (
		<div className={classNames("FlowMenu")}>
			<div className={classNames("FlowMenu__strategyName")}>
				<Input isStatic defaultValue={strategyName} />
			</div>

			<div>{children}</div>
		</div>
	)
}

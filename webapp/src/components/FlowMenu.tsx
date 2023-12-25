import { classNames } from "_/classNames"
import { StrategyContext } from "_/contexts/Strategy"
import { FC, PropsWithChildren, useContext } from "react"

export const FlowMenu: FC<PropsWithChildren> = ({ children }) => {
	const { strategy } = useContext(StrategyContext)

	return (
		<div className={classNames("FlowMenu")}>
			<div className={classNames("FlowMenu__strategyName")}>
				{strategy?.name || ""}
			</div>

			<div>{children}</div>
		</div>
	)
}

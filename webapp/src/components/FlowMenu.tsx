import { Flex } from "_/components/library"
import { StrategyContext } from "_/contexts/Strategy"
import { FC, PropsWithChildren, useContext } from "react"

export const FlowMenu: FC<PropsWithChildren> = ({ children }) => {
	const { strategy } = useContext(StrategyContext)

	return (
		<Flex
			alignItems="center"
			justify="space-between"
			spacing={{ mb: 5, pl: 5 }}
		>
			<div>
				<span>{strategy?.name || ""}</span>
			</div>

			<div>{children}</div>
		</Flex>
	)
}

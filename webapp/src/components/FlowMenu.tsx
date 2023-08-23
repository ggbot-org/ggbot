import { Flex } from "_/components/library"
import { FC, PropsWithChildren, useContext } from "react"

import { StrategyContext } from "../contexts/Strategy.js"

export const FlowMenu: FC<PropsWithChildren> = ({ children }) => {
	const { strategy } = useContext(StrategyContext)

	return (
		<Flex
			alignItems="center"
			justify="space-between"
			spacing={{ mb: 5, pl: 5 }}
		>
			<div>
				<span>{strategy.name}</span>
			</div>

			<div>{children}</div>
		</Flex>
	)
}

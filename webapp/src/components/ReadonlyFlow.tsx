import { Buttons } from "@ggbot2/design"
import { FC, useContext } from "react"

import { StrategyFlowContext } from "../contexts/StrategyFlow.js"
import { FlowMenu } from "./FlowMenu.js"
import { FlowViewContainer } from "./FlowViewContainer.js"
import { GoCopyStrategy } from "./GoCopyStrategy.js"
import { ShareStrategy } from "./ShareStrategy.js"

export const ReadonlyFlow: FC = () => {
	const { flowViewContainerRef } = useContext(StrategyFlowContext)

	return (
		<>
			<FlowMenu>
				<Buttons>
					<ShareStrategy />

					<GoCopyStrategy />
				</Buttons>
			</FlowMenu>

			<FlowViewContainer ref={flowViewContainerRef} />
		</>
	)
}

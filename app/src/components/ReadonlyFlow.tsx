import { Buttons } from "@ggbot2/design"
import { FC, useContext } from "react"

import { FlowMenu } from "../components/FlowMenu.js"
import { FlowViewContainer } from "../components/FlowViewContainer.js"
import { GoCopyStrategy } from "../components/GoCopyStrategy.js"
import { ShareStrategy } from "../components/ShareStrategy.js"
import { StrategyFlowContext } from "../contexts/StrategyFlow.js"

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

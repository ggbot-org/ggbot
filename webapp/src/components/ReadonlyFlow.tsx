import { FlowMenu } from "_/components/FlowMenu.js"
import { FlowViewContainer } from "_/components/FlowViewContainer.js"
import { GoCopyStrategy } from "_/components/GoCopyStrategy.js"
import { Buttons } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy.js"
import { StrategyFlowContext } from "_/contexts/StrategyFlow.js"
import { FC, useContext } from "react"

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

import { FlowMenu } from "_/components/FlowMenu"
import { FlowViewContainer } from "_/components/FlowViewContainer"
import { GoCopyStrategy } from "_/components/GoCopyStrategy"
import { Buttons } from "_/components/library"
import { ShareStrategy } from "_/components/ShareStrategy"
import { StrategyFlowContext } from "_/contexts/StrategyFlow"
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

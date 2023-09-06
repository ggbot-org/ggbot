import { PageContainer } from "_/components/PageContainer.js"
import { Strategy } from "_/components/Strategy.js"
import { StrategyProvider } from "_/contexts/Strategy.js"
import { StrategyFlowProvider } from "_/contexts/StrategyFlow.js"
import { FC } from "react"

export const StrategyPage: FC = () => (
	<PageContainer>
		<StrategyProvider>
			<StrategyFlowProvider>
				<Strategy />
			</StrategyFlowProvider>
		</StrategyProvider>
	</PageContainer>
)

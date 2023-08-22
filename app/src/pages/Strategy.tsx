import { FC } from "react"

import { Strategy } from "../components/Strategy.js"
import { StrategyProvider } from "../contexts/Strategy.js"
import { StrategyFlowProvider } from "../contexts/StrategyFlow.js"
import { PageContainer } from "./PageContainer.js"

export const StrategyPage: FC = () => (
	<PageContainer>
		<StrategyProvider>
			<StrategyFlowProvider>
				<Strategy />
			</StrategyFlowProvider>
		</StrategyProvider>
	</PageContainer>
)

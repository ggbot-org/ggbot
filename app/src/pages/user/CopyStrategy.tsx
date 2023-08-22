import { FC } from "react"

import { CopyStrategy } from "../../components/user/CopyStrategy.js"
import { StrategiesProvider } from "../../contexts/user/Strategies.js"
import { StrategyProvider } from "../../contexts/user/Strategy.js"
import { PageContainer } from "./PageContainer.js"

export const CopyStrategyPage: FC = () => (
	<PageContainer>
		<StrategiesProvider>
			<StrategyProvider>
				<CopyStrategy />
			</StrategyProvider>
		</StrategiesProvider>
	</PageContainer>
)

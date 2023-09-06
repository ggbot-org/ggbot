import { CopyStrategy } from "_/components/user/CopyStrategy.js"
import { PageContainer } from "_/components/user/PageContainer.js"
import { StrategiesProvider } from "_/contexts/user/Strategies.js"
import { StrategyProvider } from "_/contexts/user/Strategy.js"
import { FC } from "react"

export const CopyStrategyPage: FC = () => (
	<PageContainer>
		<StrategiesProvider>
			<StrategyProvider>
				<CopyStrategy />
			</StrategyProvider>
		</StrategiesProvider>
	</PageContainer>
)

import { CopyStrategy } from "_/components/user/CopyStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyProvider } from "_/contexts/Strategy"
import { StrategiesProvider } from "_/contexts/user/Strategies"
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

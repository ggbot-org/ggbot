import { CopyStrategy } from "_/components/user/CopyStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { StrategyProvider } from "_/contexts/Strategy"
import { ManageStrategyProvider } from "_/contexts/user/ManageStrategy"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { FC } from "react"

export const CopyStrategyPage: FC = () => (
	<PageContainer>
		<StrategiesProvider>
			<StrategyProvider>
				<ManageStrategyProvider>
					<CopyStrategy />
				</ManageStrategyProvider>
			</StrategyProvider>
		</StrategiesProvider>
	</PageContainer>
)

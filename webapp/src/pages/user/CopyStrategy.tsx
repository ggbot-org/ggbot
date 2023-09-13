import { CopyStrategy } from "_/components/user/CopyStrategy"
import { PageContainer } from "_/components/user/PageContainer"
import { ManageStrategyProvider } from "_/contexts/user/ManageStrategy"
import { StrategiesProvider } from "_/contexts/user/Strategies"
import { FC } from "react"

export const CopyStrategyPage: FC = () => (
	<PageContainer>
		<StrategiesProvider>
			<ManageStrategyProvider>
				<CopyStrategy />
			</ManageStrategyProvider>
		</StrategiesProvider>
	</PageContainer>
)

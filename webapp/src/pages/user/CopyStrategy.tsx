import { CopyStrategy } from "_/components/user/CopyStrategy.js"
import { PageContainer } from "_/components/user/PageContainer.js"
import { ManageStrategyProvider } from "_/contexts/user/ManageStrategy.js"
import { StrategiesProvider } from "_/contexts/user/Strategies.js"
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

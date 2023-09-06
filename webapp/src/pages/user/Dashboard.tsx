import { Dashboard } from "_/components/user/Dashboard.js"
import { PageContainer } from "_/components/user/PageContainer.js"
import { StrategiesProvider } from "_/contexts/user/Strategies.js"
import { FC } from "react"

export const DashboardPage: FC = () => (
	<PageContainer>
		<StrategiesProvider>
			<Dashboard />
		</StrategiesProvider>
	</PageContainer>
)

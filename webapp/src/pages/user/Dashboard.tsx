import { FC } from "react"

import { Dashboard } from "../../components/user/Dashboard.js"
import { StrategiesProvider } from "../../contexts/user/Strategies.js"
import { PageContainer } from "./PageContainer.js"

export const DashboardPage: FC = () => (
	<PageContainer>
		<StrategiesProvider>
			<Dashboard />
		</StrategiesProvider>
	</PageContainer>
)

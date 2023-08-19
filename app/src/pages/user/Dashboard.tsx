import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer.js"
import { Dashboard } from "../../components/user/Dashboard.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"
import { StrategiesProvider } from "../../contexts/user/Strategies.js"

export const DashboardPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<StrategiesProvider>
					<Dashboard />
				</StrategiesProvider>
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)

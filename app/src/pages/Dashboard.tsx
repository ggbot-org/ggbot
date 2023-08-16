import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { Dashboard } from "../components/Dashboard.js"
import { PageContainer } from "../components/PageContainer.js"
import { AccountStrategiesProvider } from "../contexts/AccountStrategies.js"
import { AuthenticationProvider } from "../contexts/Authentication.js"

export const DashboardPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<AccountStrategiesProvider>
					<Dashboard />
				</AccountStrategiesProvider>
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)

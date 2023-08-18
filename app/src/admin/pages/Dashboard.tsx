import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { AuthenticationProvider } from "../../authentication/contexts/Authentication.js"
import { PageContainer } from "../../components/PageContainer.js"
import { Dashboard } from "../components/Dashboard.js"

export const DashboardPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<Dashboard />
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)

import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { Dashboard } from "../../components/admin/Dashboard.js"
import { PageContainer } from "../../components/PageContainer.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"

export const DashboardPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<Dashboard />
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)

import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { AdminDashboard } from "../components/AdminDashboard.js"
import { PageContainer } from "../components/PageContainer.js"
import { AuthenticationProvider } from "../contexts/Authentication.js"

export const AdminDashboardPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<PageContainer>
				<AdminDashboard />
			</PageContainer>
		</AuthenticationProvider>
	</I18nProvider>
)

import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { AccountDetails } from "../../components/admin/AccountDetails.js"
import { PageContainer } from "../../components/PageContainer.js"
import { AccountProvider } from "../../contexts/admin/Account.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"

export const AccountDetailsPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<AccountProvider>
				<PageContainer>
					<AccountDetails />
				</PageContainer>
			</AccountProvider>
		</AuthenticationProvider>
	</I18nProvider>
)

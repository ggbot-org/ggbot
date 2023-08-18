import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { AuthenticationProvider } from "../../authentication/contexts/Authentication.js"
import { PageContainer } from "../../components/PageContainer.js"
import { AccountDetails } from "../components/AccountDetails.js"
import { AccountProvider } from "../contexts/Account.js"

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

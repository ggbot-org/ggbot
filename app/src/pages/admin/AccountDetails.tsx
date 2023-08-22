import { FC } from "react"

import { AccountDetails } from "../../components/admin/AccountDetails.js"
import { AccountProvider } from "../../contexts/admin/Account.js"
import { PageContainer } from "./PageContainer.js"

export const AccountDetailsPage: FC = () => (
	<PageContainer>
		<AccountProvider>
			<AccountDetails />
		</AccountProvider>
	</PageContainer>
)

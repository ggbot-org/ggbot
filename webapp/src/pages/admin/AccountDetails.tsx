import { AccountDetails } from "_/components/admin/AccountDetails.js"
import { PageContainer } from "_/components/admin/PageContainer.js"
import { AccountProvider } from "_/contexts/admin/Account.js"
import { FC } from "react"

export const AccountDetailsPage: FC = () => (
	<PageContainer>
		<AccountProvider>
			<AccountDetails />
		</AccountProvider>
	</PageContainer>
)

import { Column, Columns, Section } from "_/components/library"
import { AccountSettings } from "_/components/user/AccountSettings.js"
import { DeleteAccount } from "_/components/user/DeleteAccount.js"
import { PageContainer } from "_/components/user/PageContainer.js"
import { FC } from "react"

export const AccountSettingsPage: FC = () => (
	<PageContainer>
		<Section>
			<Columns>
				<Column size="half">
					<AccountSettings />
				</Column>
			</Columns>
		</Section>

		<Section>
			<DeleteAccount />
		</Section>
	</PageContainer>
)

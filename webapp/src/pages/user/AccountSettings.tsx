import { Columns, OneColumn, Section } from "_/components/library"
import { AccountSettings } from "_/components/user/AccountSettings"
import { DeleteAccount } from "_/components/user/DeleteAccount"
import { PageContainer } from "_/components/user/PageContainer"
import { FC } from "react"

export const AccountSettingsPage: FC = () => (
	<PageContainer>
		<Section>
			<Columns>
				<OneColumn>
					<AccountSettings />
				</OneColumn>
			</Columns>
		</Section>

		<Section>
			<DeleteAccount />
		</Section>
	</PageContainer>
)

import { Column, Columns, Section } from "@ggbot2/design"
import { FC } from "react"

import { AccountSettings } from "../../components/user/AccountSettings.js"
import { DeleteAccount } from "../../components/user/DeleteAccount.js"
import { PageContainer } from "./PageContainer.js"

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

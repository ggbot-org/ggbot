import { Column, Columns, Section } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer"
import { AccountSettings } from "../../components/user/AccountSettings"
import { DeleteAccount } from "../../components/user/DeleteAccount"
import { AuthenticationProvider } from "../../contexts/Authentication"

export const AccountSettingsPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
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
		</AuthenticationProvider>
	</I18nProvider>
)
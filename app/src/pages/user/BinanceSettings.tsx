import { Section } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer.js"
import { BinanceSettings } from "../../components/user/BinanceSettings.js"
import { AuthenticationProvider } from "../../contexts/Authentication.js"
import { BinanceApiConfigProvider } from "../../contexts/user/BinanceApiConfig.js"

export const BinanceSettingsPage: FC = () => (
	<I18nProvider>
		<AuthenticationProvider>
			<BinanceApiConfigProvider>
				<PageContainer>
					<Section>
						<BinanceSettings />
					</Section>
				</PageContainer>
			</BinanceApiConfigProvider>
		</AuthenticationProvider>
	</I18nProvider>
)

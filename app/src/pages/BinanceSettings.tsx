import { Section } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { BinanceSettings } from "../components/BinanceSettings.js"
import { PageContainer } from "../components/PageContainer.js"
import { AuthenticationProvider } from "../contexts/Authentication.js"
import { BinanceApiConfigProvider } from "../contexts/BinanceApiConfig.js"

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

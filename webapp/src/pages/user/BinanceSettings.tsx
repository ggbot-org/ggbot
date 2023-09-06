import { Section } from "_/components/library"
import { PageContainer } from "_/components/PageContainer.js"
import { BinanceSettings } from "_/components/user/BinanceSettings.js"
import { BinanceApiConfigProvider } from "_/contexts/user/BinanceApiConfig.js"
import { FC } from "react"

export const BinanceSettingsPage: FC = () => (
	<PageContainer>
		<BinanceApiConfigProvider>
			<Section>
				<BinanceSettings />
			</Section>
		</BinanceApiConfigProvider>
	</PageContainer>
)

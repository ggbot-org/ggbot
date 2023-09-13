import { Section } from "_/components/library"
import { PageContainer } from "_/components/PageContainer"
import { BinanceSettings } from "_/components/user/BinanceSettings"
import { BinanceApiConfigProvider } from "_/contexts/user/BinanceApiConfig"
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

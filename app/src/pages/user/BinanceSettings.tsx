import { Section } from "@ggbot2/design"
import { FC } from "react"

import { BinanceSettings } from "../../components/user/BinanceSettings.js"
import { BinanceApiConfigProvider } from "../../contexts/user/BinanceApiConfig.js"
import { PageContainer } from "./PageContainer.js"

export const BinanceSettingsPage: FC = () => (
	<PageContainer>
		<BinanceApiConfigProvider>
			<Section>
				<BinanceSettings />
			</Section>
		</BinanceApiConfigProvider>
	</PageContainer>
)

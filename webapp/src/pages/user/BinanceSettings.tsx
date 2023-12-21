import { Section } from "_/components/library"
import { BinanceSettings } from "_/components/user/BinanceSettings"
import { PageContainer } from "_/components/user/PageContainer"
import { FC } from "react"

export const BinanceSettingsPage: FC = () => (
	<PageContainer>
		<Section>
			<BinanceSettings />
		</Section>
	</PageContainer>
)

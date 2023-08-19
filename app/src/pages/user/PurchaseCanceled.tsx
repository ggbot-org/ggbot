import { Section } from "@ggbot2/design"
import { I18nProvider } from "@ggbot2/i18n"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer.js"
import { PurchaseCanceled } from "../../components/user/PurchaseCanceled.js"

export const PurchaseCanceledPage: FC = () => (
	<I18nProvider>
		<PageContainer>
			<Section>
				<PurchaseCanceled />
			</Section>
		</PageContainer>
	</I18nProvider>
)

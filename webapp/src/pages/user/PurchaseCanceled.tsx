import { Section } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer.js"
import { PurchaseCanceled } from "_/components/user/PurchaseCanceled.js"
import { FC } from "react"

export const PurchaseCanceledPage: FC = () => (
	<PageContainer>
		<Section>
			<PurchaseCanceled />
		</Section>
	</PageContainer>
)

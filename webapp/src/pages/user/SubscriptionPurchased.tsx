import { Section } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer.js"
import { SubscriptionPurchased } from "_/components/user/SubscriptionPurchased.js"
import { FC } from "react"

export const SubscriptionPurchasedPage: FC = () => (
	<PageContainer>
		<Section>
			<SubscriptionPurchased />
		</Section>
	</PageContainer>
)

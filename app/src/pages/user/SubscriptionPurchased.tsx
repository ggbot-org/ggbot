import { Section } from "@ggbot2/design"
import { FC } from "react"

import { PageContainer } from "../../components/PageContainer.js"
import { SubscriptionPurchased } from "../../components/user/SubscriptionPurchased.js"

export const SubscriptionPurchasedPage: FC = () => (
	<PageContainer>
		<Section>
			<SubscriptionPurchased />
		</Section>
	</PageContainer>
)
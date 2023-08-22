import { Section } from "@ggbot2/design"
import { FC } from "react"

import { SubscriptionPurchased } from "../../components/user/SubscriptionPurchased.js"
import { PageContainer } from "./PageContainer.js"

export const SubscriptionPurchasedPage: FC = () => (
	<PageContainer>
		<Section>
			<SubscriptionPurchased />
		</Section>
	</PageContainer>
)

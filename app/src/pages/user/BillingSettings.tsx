import { Column, Columns, Section } from "@ggbot2/design"
import { FC } from "react"

import { SubscriptionInfo } from "../../components/SubscriptionInfo.js"
import { SubscriptionPurchase } from "../../components/user/SubscriptionPurchase.js"
import { SubscriptionProvider } from "../../contexts/user/Subscription.js"
import { PageContainer } from "./PageContainer.js"

export const BillingSettingsPage: FC = () => (
	<PageContainer>
		<SubscriptionProvider>
			<Section>
				<Columns>
					<Column>
						<SubscriptionInfo />
					</Column>

					<Column>
						<SubscriptionPurchase />
					</Column>
				</Columns>
			</Section>
		</SubscriptionProvider>
	</PageContainer>
)

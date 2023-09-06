import { Column, Columns, Section } from "_/components/library"
import { SubscriptionInfo } from "_/components/SubscriptionInfo.js"
import { PageContainer } from "_/components/user/PageContainer.js"
import { SubscriptionPurchase } from "_/components/user/SubscriptionPurchase.js"
import { SubscriptionProvider } from "_/contexts/user/Subscription.js"
import { FC } from "react"

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

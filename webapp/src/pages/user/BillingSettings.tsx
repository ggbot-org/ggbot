import { Column, Columns, Section } from "_/components/library"
import { SubscriptionInfo } from "_/components/SubscriptionInfo"
import { PageContainer } from "_/components/user/PageContainer"
import { SubscriptionPurchase } from "_/components/user/SubscriptionPurchase"
import { SubscriptionProvider } from "_/contexts/user/Subscription"
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

import { Column, Columns, OneColumn, Section } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer"
import { SubscriptionInfo } from "_/components/user/SubscriptionInfo"
import { SubscriptionPurchase } from "_/components/user/SubscriptionPurchase"
import { FC } from "react"

export const BillingSettingsPage: FC = () => (
	<PageContainer>
		<Section>
			<Columns>
				<OneColumn>
					<SubscriptionInfo />
				</OneColumn>
			</Columns>

			<Columns>
				<Column isNarrow>
					<SubscriptionPurchase />
				</Column>
			</Columns>
		</Section>
	</PageContainer>
)

import { Columns, OneColumn, Section } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer"
import { SubscriptionPurchased } from "_/components/user/SubscriptionPurchased"

export function SubscriptionPurchasedPage() {
	return (
		<PageContainer>
			<Section>
				<Columns>
					<OneColumn>
						<SubscriptionPurchased />
					</OneColumn>
				</Columns>
			</Section>
		</PageContainer>
	)
}

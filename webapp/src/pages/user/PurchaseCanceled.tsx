import { Columns, OneColumn, Section } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer"
import { PurchaseCanceled } from "_/components/user/PurchaseCanceled"

export function PurchaseCanceledPage() {
	return (
		<PageContainer>
			<Section>
				<Columns>
					<OneColumn>
						<PurchaseCanceled />
					</OneColumn>
				</Columns>
			</Section>
		</PageContainer>
	)
}

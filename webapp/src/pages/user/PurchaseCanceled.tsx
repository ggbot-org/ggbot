import { Columns, OneColumn, Section } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer"
import { PurchaseCanceled } from "_/components/user/PurchaseCanceled"
import { FC } from "react"

export const PurchaseCanceledPage: FC = () => (
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

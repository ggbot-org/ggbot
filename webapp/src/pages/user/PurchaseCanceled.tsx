import { Columns, OneColumn, Section } from "_/components/library"
import { Message } from "_/components/library"
import { PageContainer } from "_/components/user/PageContainer"
import { FormattedMessage } from "react-intl"

export function PurchaseCanceledPage() {
	return (
		<PageContainer>
			<Section>
				<Columns>
					<OneColumn>
						<Message color="warning">
							<FormattedMessage id="PurchaseCanceled.message" />
						</Message>
					</OneColumn>
				</Columns>
			</Section>
		</PageContainer>
	)
}

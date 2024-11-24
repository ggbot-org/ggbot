import { Columns, OneColumn } from '_/components/library'
import { Message } from '_/components/library'
import { PageContainer } from '_/components/user/PageContainer'
import { FormattedMessage } from '_/i18n/components'

export function PurchaseCanceledPage() {
	return (
		<PageContainer>
			<Columns>
				<OneColumn>
					<Message color="warning">
						<FormattedMessage id="PurchaseCanceled.message" />
					</Message>
				</OneColumn>
			</Columns>
		</PageContainer>
	)
}

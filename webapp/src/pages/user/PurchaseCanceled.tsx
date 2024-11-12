import { Columns, OneColumn } from '_/components/library'
import { Message } from '_/components/library'
import { PageContainer } from '_/components/user/PageContainer'
import { FormattedMessage } from 'react-intl'

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

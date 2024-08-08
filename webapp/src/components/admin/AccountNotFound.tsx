import { Column, Columns, Content, Message } from "_/components/library"
import { AccountId } from "_/components/readonlyFields"
import { AccountKey } from "@workspace/models"
import { FormattedMessage } from "react-intl"

export function AccountNotFound({ accountKey: { accountId } }: { accountKey: AccountKey }) {
	return (
		<Message
			color="warning"
			header={<FormattedMessage id="AccountNotFound.title" />}
		>
			<Content>
				<Columns>
					<Column>
						<AccountId value={accountId} />
					</Column>
				</Columns>
			</Content>
		</Message>
	)
}

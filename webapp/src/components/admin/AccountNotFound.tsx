import { AccountId } from "_/components/AccountId.js"
import { Column, Columns, Content, Message } from "_/components/library"
import { AccountKey } from "@ggbot2/models"
import { FC } from "react"
import { useIntl } from "react-intl"

type Props = AccountKey

export const AccountNotFound: FC<Props> = ({ accountId }) => {
	const { formatMessage } = useIntl()

	return (
		<Message
			color="warning"
			header={formatMessage({ id: "AccountNotFound.title" })}
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

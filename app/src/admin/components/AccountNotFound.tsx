import { Column, Columns, Content, Message } from "@ggbot2/design"
import { AccountKey } from "@ggbot2/models"
import { FC } from "react"
import { useIntl } from "react-intl"

import { AccountId } from "../../components/AccountId.js"

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

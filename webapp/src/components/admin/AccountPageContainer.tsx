import { Column, Columns, Content, Message, OneColumn } from "_/components/library"
import { AccountId } from "_/components/readonlyFields"
import { useReadAccountInfo } from "_/hooks/admin/api"
import { useAccountKey } from "_/hooks/admin/useAccountKey"
import { AccountKey } from "@workspace/models"
import { PropsWithChildren, useEffect } from "react"
import { FormattedMessage } from "react-intl"

function AccountNotFound({ accountKey: { accountId } }: { accountKey: AccountKey }) {
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

function InvalidAccountKey() {
	return (
		<Message color="info">
			<FormattedMessage id="InvalidAccountKey.message" />
		</Message>
	)
}

export function AccountPageContainer({ children }: PropsWithChildren) {
	const { accountKey } = useAccountKey()
	const { data: account, canRun, request } = useReadAccountInfo()

	useEffect(() => {
		if (!accountKey) return
		if (canRun) request(accountKey)
	}, [canRun, request, accountKey])

	if (!accountKey) return (
		<OneColumn>
			<InvalidAccountKey />
		</OneColumn>
	)

	if (account === undefined) return null

	if (account === null) return (
		<OneColumn>
			<AccountNotFound accountKey={accountKey} />
		</OneColumn>
	)

	return children
}

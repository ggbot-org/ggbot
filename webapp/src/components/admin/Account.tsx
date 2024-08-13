import { Email } from "_/components/Email"
import { Div, Title } from "_/components/library"
import { AccountId, WhenCreated } from "_/components/readonlyFields"
import { useReadAccountInfo } from "_/hooks/admin/api"
import { useAccountKey } from "_/hooks/admin/useAccountKey"
import { useEffect } from "react"
import { FormattedMessage } from "react-intl"

export function Account() {
	const { accountKey } = useAccountKey()

	const { canRun, data: account, request } = useReadAccountInfo()

	useEffect(() => {
		if (!accountKey) return
		if (canRun) request(accountKey)
	}, [canRun, request, accountKey])

	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="AccountInfo.title" />
			</Title>
			<Email isStatic value={account?.email} />
			<WhenCreated value={account?.whenCreated} />
			<AccountId value={account?.id} />
		</Div>
	)
}

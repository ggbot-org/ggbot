import { EnterAsAccount } from '_/components/admin/EnterAsAccount'
import { Div, OneColumn, Title } from '_/components/library'
import { AccountId, Email, WhenCreated } from '_/components/readonlyFields'
import { useReadAccountInfo } from '_/hooks/admin/api'
import { useAccountKey } from '_/hooks/admin/useAccountKey'
import { FormattedMessage } from '_/i18n/components'
import { useEffect } from 'react'

export function Account() {
	const { accountKey } = useAccountKey()

	const { canRun, data: account, request } = useReadAccountInfo()

	useEffect(() => {
		if (!accountKey) return
		if (canRun) request(accountKey)
	}, [canRun, request, accountKey])

	return (
		<>
			<OneColumn>
				<Div bulma="box">
					<Title>
						<FormattedMessage id="AccountInfo.title" />
					</Title>
					<Email value={account?.email} />
					<WhenCreated value={account?.whenCreated} />
					<AccountId value={account?.id} />
				</Div>
			</OneColumn>
			<EnterAsAccount accountId={account?.id} />
		</>
	)
}

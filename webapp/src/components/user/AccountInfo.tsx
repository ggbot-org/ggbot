import { Div, Title } from '_/components/library'
import { AccountId, Email, WhenCreated } from '_/components/readonlyFields'
import { AuthenticationContext } from '_/contexts/Authentication'
import { FormattedMessage } from '_/i18n/components'
import { useContext } from 'react'

export function AccountInfo() {
	const { accountId, accountEmail, accountWhenCreated } = useContext(
		AuthenticationContext
	)

	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="AccountInfo.title" />
			</Title>
			<Email value={accountEmail} />
			<WhenCreated value={accountWhenCreated} />
			<AccountId value={accountId} />
		</Div>
	)
}

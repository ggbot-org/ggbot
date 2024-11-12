import { Div, Title } from '_/components/library'
import { AccountId, Email, WhenCreated } from '_/components/readonlyFields'
import { AuthenticationContext } from '_/contexts/Authentication'
import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'

export function AccountInfo() {
	const { accountId, accountEmail, accountWhenCreated } = useContext(AuthenticationContext)

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

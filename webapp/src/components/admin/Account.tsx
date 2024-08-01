import { Email } from "_/components/Email"
import { Div, Title } from "_/components/library"
import { AccountId, WhenCreated } from "_/components/readonlyFields"
import { AccountContext } from "_/contexts/admin/Account"
import { useContext } from "react"
import { FormattedMessage } from "react-intl"

export function Account() {
	const { account } = useContext(AccountContext)

	if (!account) return null

	return (
		<Div bulma="box">
			<Title>
				<FormattedMessage id="AccountInfo.title" />
			</Title>

			<Email isStatic value={account.email} />

			<WhenCreated value={account.whenCreated} />

			<AccountId value={account.id} />
		</Div>
	)
}

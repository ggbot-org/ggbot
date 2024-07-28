import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import { Div, Title } from "_/components/library"
import { WhenCreated } from "_/components/WhenCreated"
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

import { Email } from "_/components/Email"
import { Div, Title } from "_/components/library"
import { AccountId, WhenCreated } from "_/components/readonlyFields"
import { useStoredAccountInfo } from "_/hooks/user/useStoredAccountInfo"
import { FormattedMessage } from "react-intl"

export function AccountInfo() {
	const account = useStoredAccountInfo()

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

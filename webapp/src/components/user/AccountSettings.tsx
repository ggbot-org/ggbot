import { AccountId } from "_/components/AccountId.js"
import { Email } from "_/components/Email.js"
import { Box, Title } from "_/components/library"
import { WhenCreated } from "_/components/WhenCreated.js"
import { AuthenticationContext } from "_/contexts/Authentication.js"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const AccountSettings: FC = () => {
	const { account } = useContext(AuthenticationContext)

	return (
		<Box>
			<Title>
				<FormattedMessage id="AccountSettings.title" />
			</Title>

			<Email isStatic value={account.email} />

			<WhenCreated value={account.whenCreated} />

			<AccountId value={account.id} />
		</Box>
	)
}

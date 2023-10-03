import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import { Box, Title } from "_/components/library"
import { WhenCreated } from "_/components/WhenCreated"
import { AuthenticationContext } from "_/contexts/Authentication"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const AccountSettings: FC = () => {
	const { account } = useContext(AuthenticationContext)

	return (
		<Box>
			<Title>
				<FormattedMessage id="AccountSettings.title" />
			</Title>

			<Email isStatic value={account?.email} />

			<WhenCreated value={account?.whenCreated} />

			<AccountId value={account?.id} />
		</Box>
	)
}

import { Box, Title } from "@ggbot2/design"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { AuthenticationContext } from "../authentication/contexts/Authentication.js"
import { AccountId } from "../components/AccountId.js"
import { Email } from "../components/Email.js"
import { WhenCreated } from "../components/WhenCreated.js"

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

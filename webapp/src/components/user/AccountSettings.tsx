import { Box, Title } from "@ggbot2/design"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

import { AuthenticationContext } from "../../contexts/Authentication.js"
import { AccountId } from "../AccountId.js"
import { Email } from "../Email.js"
import { WhenCreated } from "../WhenCreated.js"

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

import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import { Box, Title } from "_/components/library"
import { SelectCountry } from "_/components/user/SelectCountry"
import { WhenCreated } from "_/components/WhenCreated"
import { AuthenticationContext } from "_/contexts/Authentication"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const AccountInfo: FC = () => {
	const { accountWhenCreated, accountEmail, accountId } = useContext(
		AuthenticationContext
	)

	return (
		<Box>
			<Title>
				<FormattedMessage id="AccountInfo.title" />
			</Title>

			<Email isStatic value={accountEmail} />

			<SelectCountry />

			<WhenCreated value={accountWhenCreated} />

			<AccountId value={accountId} />
		</Box>
	)
}

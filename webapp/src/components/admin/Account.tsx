import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import { Box, Title } from "_/components/library"
import { WhenCreated } from "_/components/WhenCreated"
import { AccountContext } from "_/contexts/admin/Account"
import { FC, useContext } from "react"
import { FormattedMessage } from "react-intl"

export const Account: FC = () => {
	const { account } = useContext(AccountContext)

	if (!account) return null

	return (
		<Box>
			<Title>
				<FormattedMessage id="AccountInfo.title" />
			</Title>

			<Email isStatic value={account.email} />

			<WhenCreated value={account.whenCreated} />

			<AccountId value={account.id} />
		</Box>
	)
}

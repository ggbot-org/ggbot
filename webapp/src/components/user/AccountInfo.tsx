import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import { Box, Title } from "_/components/library"
import { WhenCreated } from "_/components/WhenCreated"
import { useStoredAccount } from "_/hooks/useStoredAccount"
import { FC } from "react"
import { FormattedMessage } from "react-intl"

export const AccountInfo: FC = () => {
	const account = useStoredAccount()

	return (
		<Box>
			<Title>
				<FormattedMessage id="AccountInfo.title" />
			</Title>

			<Email isStatic value={account?.email} />

			<WhenCreated value={account?.whenCreated} />

			<AccountId value={account?.id} />
		</Box>
	)
}

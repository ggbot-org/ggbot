import { AccountId } from "_/components/AccountId"
import { Email } from "_/components/Email"
import { Box, Title } from "_/components/library"
import { WhenCreated } from "_/components/WhenCreated"
import { useStoredAccountInfo } from "_/hooks/useStoredAccountInfo"
import { FormattedMessage } from "react-intl"

export function AccountInfo() {
	const account = useStoredAccountInfo()

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

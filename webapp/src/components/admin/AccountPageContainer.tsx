import { AccountNotFound } from "_/components/admin/AccountNotFound"
import { InvalidAccountKey } from "_/components/admin/InvalidAccountKey"
import { useAccount } from "_/hooks/admin/useAccount"
import { useAccountKey } from "_/hooks/admin/useAccountKey"
import { PropsWithChildren } from "react"

export function AccountPageContainer({ children }: PropsWithChildren) {
	const { accountKey } = useAccountKey()
	const { account } = useAccount(accountKey)

	if (!accountKey) return <InvalidAccountKey />

	if (account === undefined) return null

	if (account === null) return <AccountNotFound accountKey={accountKey} />

	return children
}

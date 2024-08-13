import { AccountNotFound } from "_/components/admin/AccountNotFound"
import { InvalidAccountKey } from "_/components/admin/InvalidAccountKey"
import { useReadAccountInfo } from "_/hooks/admin/api"
import { useAccountKey } from "_/hooks/admin/useAccountKey"
import { PropsWithChildren, useEffect } from "react"

export function AccountPageContainer({ children }: PropsWithChildren) {
	const { accountKey } = useAccountKey()
	const { data: account, canRun, request } = useReadAccountInfo()

	useEffect(() => {
		if (!accountKey) return
		if (canRun) request(accountKey)
	}, [canRun, request, accountKey])

	if (!accountKey) return <InvalidAccountKey />

	if (account === undefined) return null

	if (account === null) return <AccountNotFound accountKey={accountKey} />

	return children
}

import { AccountNotFound } from "_/components/admin/AccountNotFound"
import { InvalidAccountKey } from "_/components/admin/InvalidAccountKey"
import { Section } from "_/components/library"
import { useAdminApi } from "_/hooks/useAdminApi"
import { accountKeyParamsFromURL } from "_/routing/paramFromURL"
import { Account } from "@workspace/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	account: Account | undefined | null
}

export const AccountContext = createContext<ContextValue>({
	account: undefined
})

AccountContext.displayName = "AccountContext"

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
	const accountKey = accountKeyParamsFromURL(new URL(window.location.href))

	const READ_ACCOUNT = useAdminApi.ReadAccount()
	const account = READ_ACCOUNT.data

	const contextValue = useMemo<ContextValue>(
		() => ({
			account
		}),
		[account]
	)

	// Fetch account.
	useEffect(() => {
		if (!accountKey) return
		if (READ_ACCOUNT.canRun) READ_ACCOUNT.request(accountKey)
	}, [READ_ACCOUNT, accountKey])

	if (!accountKey)
		return (
			<Section>
				<InvalidAccountKey />
			</Section>
		)

	if (account === undefined) return null

	if (account === null)
		return (
			<Section>
				<AccountNotFound {...accountKey} />
			</Section>
		)

	return (
		<AccountContext.Provider value={contextValue}>
			{children}
		</AccountContext.Provider>
	)
}

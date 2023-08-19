import { Section } from "@ggbot2/design"
import { Account, noneAccount } from "@ggbot2/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

import { AccountNotFound } from "../../components/admin/AccountNotFound.js"
import { InvalidAccountKey } from "../../components/admin/InvalidAccountKey.js"
import { useAdminApi } from "../../hooks/useAdminApi.js"
import { accountKeyParamsFromCurrentLocation } from "../../routing/admin/accountKeyParams.js"

type ContextValue = {
	// If `accountKey` is not valid or no `account` was found, `children` are not rendered.
	account: Account
}

const AccountContext = createContext<ContextValue>({
	account: noneAccount
})

AccountContext.displayName = "AccountContext"

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
	const accountKey = accountKeyParamsFromCurrentLocation()

	const READ_ACCOUNT = useAdminApi.ReadAccount()
	const account = READ_ACCOUNT.data

	const contextValue = useMemo<ContextValue>(
		() => ({
			account: account ?? noneAccount
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

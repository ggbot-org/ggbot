import { AccountStrategies, isAccountStrategies } from "@ggbot2/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

import { useUserApi } from "../hooks/useUserApi.js"

type ContextValue = {
	accountStrategies: AccountStrategies | undefined
	refetchAccountStrategies: () => void
}

export const AccountStrategiesContext = createContext<ContextValue>({
	accountStrategies: undefined,
	refetchAccountStrategies: () => {}
})

AccountStrategiesContext.displayName = "AccountStrategies"

export const AccountStrategiesProvider: FC<PropsWithChildren> = ({
	children
}) => {
	const READ = useUserApi.ReadAccountStrategies()

	const contextValue = useMemo(
		() => ({
			accountStrategies:
				READ.data === null || isAccountStrategies(READ.data)
					? READ.data
					: undefined,
			refetchAccountStrategies: READ.reset
		}),
		[READ]
	)

	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	return (
		<AccountStrategiesContext.Provider value={contextValue}>
			{children}
		</AccountStrategiesContext.Provider>
	)
}

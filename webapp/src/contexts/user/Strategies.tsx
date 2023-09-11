import { useUserApi } from "_/hooks/useUserApi.js"
import { AccountStrategies, isAccountStrategies } from "@workspace/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	accountStrategies: AccountStrategies | undefined
	refetchAccountStrategies: () => void
}

export const StrategiesContext = createContext<ContextValue>({
	accountStrategies: undefined,
	refetchAccountStrategies: () => {}
})

StrategiesContext.displayName = "Strategies"

export const StrategiesProvider: FC<PropsWithChildren> = ({ children }) => {
	const READ = useUserApi.ReadStrategies()

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
		<StrategiesContext.Provider value={contextValue}>
			{children}
		</StrategiesContext.Provider>
	)
}

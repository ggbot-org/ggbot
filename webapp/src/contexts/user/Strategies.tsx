import { useUserApi } from "_/hooks/useUserApi"
import { AccountStrategy } from "@workspace/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	accountStrategies: AccountStrategy[] | undefined
	refetchAccountStrategies: () => void
}

export const StrategiesContext = createContext<ContextValue>({
	accountStrategies: undefined,
	refetchAccountStrategies: () => {}
})

StrategiesContext.displayName = "Strategies"

export const StrategiesProvider: FC<PropsWithChildren> = ({ children }) => {
	const READ = useUserApi.ReadAccountStrategies()

	const contextValue = useMemo(() => ({
			accountStrategies: READ.data,
			refetchAccountStrategies: READ.reset
		}), [READ])

	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	return (
		<StrategiesContext.Provider value={contextValue}>
			{children}
		</StrategiesContext.Provider>
	)
}

import { useUserApi } from "_/hooks/useUserApi"
import { AccountStrategy } from "@workspace/models"
import { createContext, FC, PropsWithChildren, useEffect, useMemo } from "react"

type ContextValue = {
	accountStrategies: AccountStrategy[] | undefined
	fetchAccountStrategiesIsPending?: boolean
	refetchAccountStrategies: () => void
}

// TODO move to hook useStrategies
export const StrategiesContext = createContext<ContextValue>({
	accountStrategies: undefined,
	refetchAccountStrategies: () => {}
})

StrategiesContext.displayName = "Strategies"

export const StrategiesProvider: FC<PropsWithChildren> = ({ children }) => {
	const READ = useUserApi.ReadStrategies()

	const contextValue = useMemo(
		() => ({
			accountStrategies: READ.data,
			fetchAccountStrategiesIsPending: READ.isPending,
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

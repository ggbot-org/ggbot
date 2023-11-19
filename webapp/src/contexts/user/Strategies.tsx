import { useUserApi } from "_/hooks/useUserApi"
import { AccountStrategy, isAccountStrategy } from "@workspace/models"
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

	const contextValue = useMemo(() => {
		const accountStrategies: AccountStrategy[] = []
		const { data, reset } = READ

		if (Array.isArray(data)) {
			for (const item of data)
				if (isAccountStrategy(item)) accountStrategies.push(item)
			return {
				accountStrategies,
				refetchAccountStrategies: reset
			}
		}

		return {
			accountStrategies: undefined,
			refetchAccountStrategies: reset
		}
	}, [READ])

	useEffect(() => {
		if (READ.canRun) READ.request()
	}, [READ])

	return (
		<StrategiesContext.Provider value={contextValue}>
			{children}
		</StrategiesContext.Provider>
	)
}

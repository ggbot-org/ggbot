import { StrategyContext } from "_/contexts/Strategy"
import { UseActionError } from "_/hooks/useAction"
import { useUserApi } from "_/hooks/useUserApi"
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState
} from "react"

type ContextValue = {
	renameStrategy: (name: string) => void
	renameIsDone: boolean
	renameIsPending?: boolean | undefined
	renameError?: UseActionError
}

export const ManageStrategyContext = createContext<ContextValue>({
	renameStrategy: () => {},
	renameIsDone: false
})

ManageStrategyContext.displayName = "ManageStrategyContext"

export const ManageStrategyProvider: FC<PropsWithChildren> = ({ children }) => {
	const { strategyKey, refetchStrategy } = useContext(StrategyContext)

	const [renameError, setRenameError] = useState<UseActionError>()

	const RENAME = useUserApi.RenameStrategy()
	const renameIsDone = RENAME.isDone
	const renameIsPending = RENAME.isPending

	const renameStrategy = useCallback<ContextValue["renameStrategy"]>(
		(newName) => {
			if (!strategyKey) return
			if (RENAME.canRun)
				RENAME.request({
					name: newName,
					...strategyKey
				})
		},
		[RENAME, strategyKey]
	)

	const contextValue = useMemo<ContextValue>(
		() => ({
			renameStrategy,
			renameIsDone,
			renameError,
			renameIsPending
		}),
		[renameStrategy, renameError, renameIsDone, renameIsPending]
	)

	useEffect(() => {
		if (RENAME.isDone) {
			RENAME.reset()
			refetchStrategy()
		}
	}, [RENAME, refetchStrategy])

	useEffect(() => {
		if (RENAME.error) {
			setRenameError(RENAME.error)
			RENAME.reset()
		}
	}, [RENAME])

	return (
		<ManageStrategyContext.Provider value={contextValue}>
			{children}
		</ManageStrategyContext.Provider>
	)
}

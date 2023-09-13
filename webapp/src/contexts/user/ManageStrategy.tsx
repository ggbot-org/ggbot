import { StrategyContext } from "_/contexts/Strategy"
import { UseActionError } from "_/hooks/useAction"
import { useUserApi } from "_/hooks/useUserApi"
import { localWebStorage } from "_/storages/local"
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
	strategyName: string
	renameIsPending?: boolean | undefined
	renameError?: UseActionError
}

export const ManageStrategyContext = createContext<ContextValue>({
	renameStrategy: () => {},
	strategyName: "",
	renameIsDone: false
})

ManageStrategyContext.displayName = "ManageStrategyContext"

export const ManageStrategyProvider: FC<PropsWithChildren> = ({ children }) => {
	const [newStrategyName, setNewStrategyName] = useState("")
	const { strategy } = useContext(StrategyContext)

	const [renameError, setRenameError] = useState<UseActionError>()

	const RENAME = useUserApi.RenameStrategy()
	const renameIsDone = RENAME.isDone
	const renameIsPending = RENAME.isPending

	const renameStrategy = useCallback<ContextValue["renameStrategy"]>(
		(newName) => {
			setNewStrategyName(newName)
			if (RENAME.canRun)
				RENAME.request({
					name: newName,
					strategyId: strategy.id,
					strategyKind: strategy.kind
				})
		},
		[RENAME, strategy]
	)

	const contextValue = useMemo<ContextValue>(
		() => ({
			renameStrategy,
			renameIsDone,
			renameError,
			renameIsPending,
			strategyName: newStrategyName ?? strategy.name
		}),
		[
			renameStrategy,
			newStrategyName,
			strategy,
			renameError,
			renameIsDone,
			renameIsPending
		]
	)

	useEffect(() => {
		if (RENAME.isDone) {
			RENAME.reset()
			localWebStorage.strategy.set({ ...strategy, name: newStrategyName })
		}
	}, [RENAME, newStrategyName, strategy])

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

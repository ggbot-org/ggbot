import { useUserApi } from "_/hooks/useUserApi"
import { BinanceApiKey } from "@workspace/models"
import {
	createContext,
	FC,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo
} from "react"

type ContextValue = Partial<BinanceApiKey> & {
	hasApiKey: undefined | boolean
	refetchApiKey: () => void
}

export const BinanceApiConfigContext = createContext<ContextValue>({
	hasApiKey: undefined,
	apiKey: undefined,
	refetchApiKey: () => {}
})

BinanceApiConfigContext.displayName = "BinanceApiConfigContext"

export const BinanceApiConfigProvider: FC<PropsWithChildren> = ({
	children
}) => {
	const READ_API_KEY = useUserApi.ReadBinanceApiKey()
	const remoteApiKey = READ_API_KEY.data

	const refetchApiKey = useCallback(() => {
		READ_API_KEY.reset()
	}, [READ_API_KEY])

	const contextValue = useMemo<ContextValue>(() => {
		const apiKey =
			remoteApiKey === undefined ? undefined : remoteApiKey?.apiKey ?? ""
		return {
			apiKey,
			hasApiKey: apiKey === undefined ? undefined : Boolean(apiKey),
			refetchApiKey
		}
	}, [remoteApiKey, refetchApiKey])

	// Fetch apiKey.
	useEffect(() => {
		if (READ_API_KEY.canRun) READ_API_KEY.request()
	}, [READ_API_KEY])

	return (
		<BinanceApiConfigContext.Provider value={contextValue}>
			{children}
		</BinanceApiConfigContext.Provider>
	)
}

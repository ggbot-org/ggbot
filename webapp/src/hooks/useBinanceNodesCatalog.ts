import { useBinanceSymbols } from "_/hooks/useBinanceSymbols.js"
import { getDflowBinanceNodesCatalog } from "@ggbot2/dflow"
import { useMemo } from "react"

export const useBinanceNodesCatalog = () => {
	const symbols = useBinanceSymbols()

	return useMemo(() => {
		if (!symbols) return
		return getDflowBinanceNodesCatalog(symbols)
	}, [symbols])
}

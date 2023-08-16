import { getDflowBinanceNodesCatalog } from "@ggbot2/dflow"
import { useMemo } from "react"

import { useBinanceSymbols } from "../hooks/useBinanceSymbols.js"

export const useBinanceNodesCatalog = () => {
	const symbols = useBinanceSymbols()

	return useMemo(() => {
		if (!symbols) return
		return getDflowBinanceNodesCatalog(symbols)
	}, [symbols])
}

import { DflowNodesCatalog } from "dflow"
import { useContext, useMemo } from "react"

import { StrategyContext } from "../contexts/Strategy.js"
import { useBinanceNodesCatalog } from "../hooks/useBinanceNodesCatalog.js"

export const useNodesCatalog = (): DflowNodesCatalog | undefined => {
	const {
		strategy: { kind: strategyKind }
	} = useContext(StrategyContext)

	const binanceNodesCatalog = useBinanceNodesCatalog()

	return useMemo(() => {
		if (strategyKind === "binance") return binanceNodesCatalog
	}, [binanceNodesCatalog, strategyKind])
}

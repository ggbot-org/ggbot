import { StrategyContext } from "_/contexts/Strategy.js"
import { useBinanceNodesCatalog } from "_/hooks/useBinanceNodesCatalog.js"
import { DflowNodesCatalog } from "dflow"
import { useContext, useMemo } from "react"

export const useNodesCatalog = (): DflowNodesCatalog | undefined => {
	const {
		strategy: { kind: strategyKind }
	} = useContext(StrategyContext)

	const binanceNodesCatalog = useBinanceNodesCatalog()

	return useMemo(() => {
		if (strategyKind === "binance") return binanceNodesCatalog
	}, [binanceNodesCatalog, strategyKind])
}

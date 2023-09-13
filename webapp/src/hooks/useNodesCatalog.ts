import { StrategyContext } from "_/contexts/Strategy"
import { useBinanceNodesCatalog } from "_/hooks/useBinanceNodesCatalog"
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

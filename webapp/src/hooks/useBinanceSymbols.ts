import { binance } from "_/binance/exchange"
import { StrategyContext } from "_/contexts/Strategy"
import {
	binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols,
	DflowBinanceSymbolInfo
} from "@workspace/dflow"
import { logging } from "@workspace/logging"
import { useContext, useEffect, useRef } from "react"

const { debug } = logging("useBinanceSymbols")

export const useBinanceSymbols = (): DflowBinanceSymbolInfo[] | undefined => {
	const { strategyKind } = useContext(StrategyContext)

	const binanceSymbolsRef = useRef<DflowBinanceSymbolInfo[]>()

	useEffect(() => {
		if (strategyKind !== "binance") return
		if (binanceSymbolsRef.current) return
		binance
			.exchangeInfo()
			.then(({ symbols }) => {
				binanceSymbolsRef.current =
					binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(
						symbols
					)
			})
			.catch(debug)
	}, [binanceSymbolsRef, strategyKind])

	return binanceSymbolsRef.current
}

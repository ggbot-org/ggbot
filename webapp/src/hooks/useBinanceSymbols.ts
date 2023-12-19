import { binance } from "_/binance/exchange"
import { StrategyContext } from "_/contexts/Strategy"
import { logging } from "_/logging"
import {
	binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols,
	DflowBinanceSymbolInfo
} from "@workspace/dflow"
import { useContext, useEffect, useRef } from "react"

const { info, warn } = logging("useBinanceSymbols")

export const useBinanceSymbols = (): DflowBinanceSymbolInfo[] | undefined => {
	const { strategyKind } = useContext(StrategyContext)

	const binanceSymbolsRef = useRef<DflowBinanceSymbolInfo[]>()

	useEffect(() => {
		if (strategyKind !== "binance") return
		if (binanceSymbolsRef.current) return
		binance
			.exchangeInfo()
			.then(({ symbols }) => {
				info(`got ${symbols.length} binance symbols`)
				binanceSymbolsRef.current =
					binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(
						symbols
					)
			})
			.catch(warn)
	}, [binanceSymbolsRef, strategyKind])

	return binanceSymbolsRef.current
}

import { binance } from "_/binance/exchange.js"
import { StrategyContext } from "_/contexts/Strategy.js"
import {
	DflowBinanceSymbolInfo,
	isDflowBinanceSymbolInfo
} from "@workspace/dflow"
import { useContext, useEffect, useRef } from "react"

export const useBinanceSymbols = (): DflowBinanceSymbolInfo[] | undefined => {
	const {
		strategy: { kind: strategyKind }
	} = useContext(StrategyContext)

	const binanceSymbolsRef = useRef<DflowBinanceSymbolInfo[]>()

	useEffect(() => {
		if (strategyKind !== "binance") return
		if (binanceSymbolsRef.current) return
		;(async () => {
			const exchangeInfo = await binance.exchangeInfo()
			binanceSymbolsRef.current = exchangeInfo.symbols.filter(
				isDflowBinanceSymbolInfo
			)
		})()
	}, [binanceSymbolsRef, strategyKind])

	return binanceSymbolsRef.current
}

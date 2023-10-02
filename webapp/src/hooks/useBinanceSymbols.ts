import { binance } from "_/binance/exchange"
import { StrategyContext } from "_/contexts/Strategy"
import {
	DflowBinanceSymbolInfo,
	isDflowBinanceSymbolInfo
} from "@workspace/dflow"
import { useContext, useEffect, useRef } from "react"

export const useBinanceSymbols = (): DflowBinanceSymbolInfo[] | undefined => {
	const { strategy } = useContext(StrategyContext)

	const binanceSymbolsRef = useRef<DflowBinanceSymbolInfo[]>()

	useEffect(() => {
		if (strategy?.kind !== "binance") return
		if (binanceSymbolsRef.current) return
		;(async () => {
			const exchangeInfo = await binance.exchangeInfo()
			binanceSymbolsRef.current = exchangeInfo.symbols.filter(
				isDflowBinanceSymbolInfo
			)
		})()
	}, [binanceSymbolsRef, strategy])

	return binanceSymbolsRef.current
}

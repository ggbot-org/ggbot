import { binance } from "_/binance/exchange"
import { StrategyContext } from "_/contexts/Strategy"
import {
	binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols,
	DflowBinanceSymbolInfo
} from "@workspace/dflow"
import { logging } from "@workspace/logging"
import { useContext, useEffect, useState } from "react"

type UseBinanceSymbolsOutput = DflowBinanceSymbolInfo[] | undefined

const { debug } = logging("useBinanceSymbols")

export function useBinanceSymbols(): UseBinanceSymbolsOutput {
	const { strategyKind } = useContext(StrategyContext)

	const [binanceSymbols, setBinanceSymbols] = useState<
		DflowBinanceSymbolInfo[]
	>([])

	useEffect(() => {
		if (strategyKind !== "binance") return
		binance
			.exchangeInfo()
			.then(({ symbols }) => {
				setBinanceSymbols(
					binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols(
						symbols
					)
				)
			})
			.catch(debug)
	}, [strategyKind])

	return binanceSymbols
}

import { binance } from "_/binance/exchange"
import {
	binanceExchangeInfoSymbolsToDflowBinanceExchangeInfoSymbols,
	DflowBinanceSymbolInfo
} from "@workspace/dflow"
import { logging } from "@workspace/logging"
import { StrategyKind } from "@workspace/models"
import { useEffect, useState } from "react"

const { debug } = logging("useBinanceSymbols")

export function useBinanceSymbols(strategyKind: StrategyKind | undefined) {
	const [binanceSymbols, setBinanceSymbols] = useState<
		DflowBinanceSymbolInfo[] | undefined
	>()

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
